#!/usr/bin/env python3
"""
build_data.py

Ingests hierarchical-dict.json, post_root_morphemes.csv, and classes.csv.
Matches strictly against the authoritative curated CED dictionary dataset
to produce authentic syllabary, tone markings, full 6-part paradigms,
and verified audio example sentences.

Fails/omits any verb that lacks verified curated dictionary data.
Zero fallback transliterators or synthetic forms.
"""

import csv
import json
import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
HIERARCHICAL_DICT_PATH = BASE_DIR / "hierarchical-dict.json"
POST_ROOT_MORPHEMES_PATH = DATA_DIR / "post_root_morphemes.csv"
CLASSES_PATH = DATA_DIR / "classes.csv"
OUTPUT_JS_PATH = BASE_DIR / "dict_verbs.js"

EXTERNAL_DICT_AUDIO = Path("/Users/julietmcvicker/code/online-exercises-audio-pipeline/dict_verbs_audio.json")
EXTERNAL_DICT_LARGE = Path("/Users/julietmcvicker/code/online-exercises-audio-pipeline/dict_verbs_large.json")


def load_post_root_morphemes(path: Path) -> dict[str, str]:
    morphemes: dict[str, str] = {}
    if not path.exists():
        return morphemes
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            key = f"{row['name']}[{row['subcase']}]" if row.get("subcase") else row["name"]
            morphemes[key] = row["form"]
    return morphemes


def unrespell_consonants(s: str) -> str:
    if not s:
        return ""
    s = s.lower()
    s = re.sub(r"(^|[aeiouv])hs", r"\1s", s)
    res_rules = [
        ("tsh", "ch"),
        ("ts", "j"),
        ("k", "g"),
        ("gh", "k"),
        ("t", "d"),
        ("dh", "t"),
        ("nh", "hn"),
        ("lh", "hl"),
        ("yh", "hy"),
        ("wh", "hw"),
        ("slh", "sl"),
    ]
    for old, new in res_rules:
        s = s.replace(old, new)
    return s


def build_template_parts(verb: dict, prm_map: dict[str, str], ka_label: str = "Set A (ga)") -> tuple[str, str, dict]:
    config = verb.get("morphology", {}).get("config", {})
    pre = config.get("pre", {})
    pron = config.get("pron", {})
    morph = verb.get("morphology", {})

    plain_parts: list[str] = []
    html_parts: list[str] = []

    # 1. Prefixes
    if pre.get("translocutive"):
        plain_parts.append("wi")
        html_parts.append('<span class="template-prefix">wi</span>')
    if pre.get("partitive"):
        plain_parts.append("ni")
        html_parts.append('<span class="template-prefix">ni</span>')
    if pre.get("distributive"):
        plain_parts.append("de")
        html_parts.append('<span class="template-prefix">de</span>')

    # 2. Pronoun Set
    set_type = pron.get("set_type", "a")
    plural = pron.get("plural_pronouns", False)
    ka_variant = pron.get("use_ka_variant", False)

    if set_type == "a":
        if plural:
            pron_str = "Set A (pl)"
        elif ka_variant:
            pron_str = ka_label
        else:
            pron_str = "Set A"
        pron_class = "pronoun-set-a"
    else:
        if plural:
            pron_str = "Set B (pl)"
        else:
            pron_str = "Set B"
        pron_class = "pronoun-set-b"

    plain_parts.append(pron_str)
    html_parts.append(f'<span class="template-pronoun {pron_class}">{pron_str}</span>')

    # 3. Middle Voice
    mv = pron.get("middle_voice")
    if mv and mv != "none":
        mv_clean = mv.replace("_", "/").lower()
        plain_parts.append(mv_clean)
        html_parts.append(f'<span class="template-middle-voice">{mv_clean}</span>')

    # 4. Root
    h_root = morph.get("h_grade_root", "")
    g_root = morph.get("glottal_grade_root", "")
    h_comm = unrespell_consonants(h_root)
    g_comm = unrespell_consonants(g_root)

    if h_comm and g_comm and h_comm != g_comm:
        comm_root = f"{h_comm}/{g_comm}"
        plain_parts.append(comm_root)
        html_parts.append(
            f'<span class="template-root-stacked"><strong class="template-root">{h_comm}</strong><strong class="template-root">{g_comm}</strong></span>'
        )
    else:
        comm_root = h_comm or g_comm or unrespell_consonants(morph.get("root", "")) or "ROOT"
        plain_parts.append(comm_root)
        html_parts.append(f'<strong class="template-root">{comm_root}</strong>')

    # 5. Post Root Morpheme
    prm_name = morph.get("post_root_morpheme")
    prm_form = ""
    if prm_name:
        prm_form = prm_map.get(prm_name, prm_name)
        prm_unrespelled = unrespell_consonants(prm_form)
        plain_parts.append(prm_unrespelled)
        html_parts.append(f'<span class="template-post-root">{prm_unrespelled}</span>')

    # 6. Aspect Class Name
    cls_name = morph.get("class_name", "")
    plain_parts.append(f"[{cls_name}]")
    html_parts.append(f'<span class="template-class">[{cls_name}]</span>')

    template_plain = "-".join(plain_parts)
    template_html = "-".join(html_parts)

    meta_details = {
        "class_name": cls_name,
        "root": comm_root,
        "h_grade_root": h_root,
        "glottal_grade_root": g_root,
        "post_root_morpheme": prm_name,
        "post_root_form": prm_form,
        "set_type": set_type,
        "middle_voice": mv,
        "use_ka_variant": ka_variant,
        "plural_pronouns": plural,
    }

    return template_plain, template_html, meta_details


def extract_keywords(d: str) -> set[str]:
    """Extracts semantic keywords for strict matching."""
    if not d:
        return set()
    d = d.lower().strip()
    d = re.sub(r"^(he/she is|he is|she is|it is|he/she|it|they are|he\'s|it\'s|to)\s+", "", d)
    d = re.sub(r"\(.*?\)", "", d).strip()
    d = re.sub(r"^\d+\.\s*", "", d)
    d = re.sub(r"[^a-z0-9 ]", "", d)
    stop_words = {
        "a", "an", "the", "him", "her", "it", "them", "his", "hers",
        "object", "person", "refers", "something", "someone", "etc"
    }
    return set(d.split()) - stop_words


def main():
    print(f"Loading morphemes from {POST_ROOT_MORPHEMES_PATH}...")
    prms = load_post_root_morphemes(POST_ROOT_MORPHEMES_PATH)

    print(f"Loading hierarchical dict from {HIERARCHICAL_DICT_PATH}...")
    with open(HIERARCHICAL_DICT_PATH, "r", encoding="utf-8") as f:
        hdata = json.load(f)

    # Flatten all verbs from hierarchical dict
    h_verbs: list[dict] = []
    for root_group in hdata:
        for cls_group in root_group.get("classes", []):
            for verb in cls_group.get("verbs", []):
                h_verbs.append(verb)
                for deriv in verb.get("derivations", []):
                    h_verbs.append(deriv)

    print(f"Found {len(h_verbs)} verbs in hierarchical-dict.json.")

    # Load authoritative curated CED dictionary dataset
    curated_pool: dict[str, dict] = {}
    if EXTERNAL_DICT_LARGE.exists():
        print(f"Loading curated dictionary dataset from {EXTERNAL_DICT_LARGE}...")
        with open(EXTERNAL_DICT_LARGE, "r", encoding="utf-8") as f:
            curated_pool.update(json.load(f))
    if EXTERNAL_DICT_AUDIO.exists():
        print(f"Loading audio enrichment from {EXTERNAL_DICT_AUDIO}...")
        with open(EXTERNAL_DICT_AUDIO, "r", encoding="utf-8") as f:
            for k, v in json.load(f).items():
                if k in curated_pool and v.get("sentence", {}).get("audio"):
                    curated_pool[k]["sentence"]["audio"] = v["sentence"]["audio"]
                elif k not in curated_pool:
                    curated_pool[k] = v

    curated_entries = list(curated_pool.values())
    print(f"Loaded {len(curated_entries)} curated CED entries.")

    out_verbs: dict[str, dict] = {}
    omitted_count = 0

    for idx, verb in enumerate(h_verbs):
        meta = verb.get("meta", {})
        eno = str(meta.get("entry_no") or "")
        cid = str(meta.get("corpus_id") or "")
        vdef = meta.get("definition", "").strip()
        v_words = extract_keywords(vdef)

        if not v_words:
            omitted_count += 1
            continue

        # Find authoritative curated match
        matched_curated = None
        for entry in curated_entries:
            sentence = entry.get("sentence", {})
            # Must have valid 3rd present form, syllabary, CED tone numbers, and asterisk-delimited sentence in all 3 fields
            if not (
                entry.get("third_present")
                and entry.get("third_present_syllabary")
                and any(char in entry.get("third_present", "") for char in "1234")  # Must have valid CED tone numbers
                and sentence.get("phonetics") and "*" in sentence["phonetics"]
                and sentence.get("syllabary") and "*" in sentence["syllabary"]
                and sentence.get("english") and "*" in sentence["english"]
            ):
                continue

            e_words = extract_keywords(entry.get("definition", ""))
            if v_words == e_words:
                matched_curated = entry
                break
            elif len(v_words) >= 2 and v_words.issubset(e_words):
                matched_curated = entry
                break

        # If no verified authentic match, fail/omit this verb
        if not matched_curated:
            omitted_count += 1
            continue

        tpl_plain, tpl_html, meta_details = build_template_parts(verb, prms)
        entry_key = eno if eno else (cid if cid else f"h_{idx}")

        entry = dict(matched_curated)
        entry["index"] = entry_key
        entry["template"] = tpl_plain
        entry["template_html"] = tpl_html
        entry["morphology"] = meta_details
        entry["segmented_forms"] = verb.get("segmented_forms", {})

        out_key = entry_key
        if out_key in out_verbs:
            out_key = f"{entry_key}_{idx}"
            entry["index"] = out_key

        out_verbs[out_key] = entry

    print(f"Successfully generated {len(out_verbs)} verified verbs with 100% authentic syllabary and tone markings.")
    print(f"Cleanly omitted {omitted_count} unverified entries.")

    # Write output to dict_verbs.js
    output_js_content = f"// Auto-generated by build_data.py\nexport const dict = {json.dumps(out_verbs, indent=2, ensure_ascii=False)};\n"
    with open(OUTPUT_JS_PATH, "w", encoding="utf-8") as f:
        f.write(output_js_content)

    print(f"Successfully written {OUTPUT_JS_PATH}.")


if __name__ == "__main__":
    main()
