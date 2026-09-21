/**
 * template_formatter.js
 * Generates and formats morphological template strings (plain text & styled HTML)
 * e.g. Set A-ROOT-at-[i-a-i] with colored pronoun sets and bold roots.
 */

import { unrespellConsonants } from "./orthography.js";

export function formatTemplate(verb, kaLabel = "Set A (ga)") {
  if (verb.template_html && verb.template) {
    return {
      plain: verb.template,
      html: verb.template_html,
    };
  }

  const morph = verb.morphology || {};
  const config = morph.config || {};
  const pre = config.pre || {};
  const pron = config.pron || {};

  const plainParts = [];
  const htmlParts = [];

  // 1. Prefixes
  if (pre.translocutive) {
    plainParts.push("wi");
    htmlParts.push('<span class="template-prefix">wi</span>');
  }
  if (pre.partitive) {
    plainParts.push("ni");
    htmlParts.push('<span class="template-prefix">ni</span>');
  }
  if (pre.distributive) {
    plainParts.push("de");
    htmlParts.push('<span class="template-prefix">de</span>');
  }

  // 2. Pronoun Set
  const setType = pron.set_type || morph.set_type || "a";
  const plural = pron.plural_pronouns || morph.plural_pronouns || false;
  const kaVariant = pron.use_ka_variant || morph.use_ka_variant || false;

  let pronStr = "";
  let pronClass = "";
  if (setType.toLowerCase() === "a") {
    if (plural) {
      pronStr = "Set A (pl)";
    } else if (kaVariant) {
      pronStr = kaLabel;
    } else {
      pronStr = "Set A";
    }
    pronClass = "pronoun-set-a";
  } else {
    if (plural) {
      pronStr = "Set B (pl)";
    } else {
      pronStr = "Set B";
    }
    pronClass = "pronoun-set-b";
  }

  plainParts.push(pronStr);
  htmlParts.push(`<span class="template-pronoun ${pronClass}">${pronStr}</span>`);

  // 3. Middle Voice
  const mv = pron.middle_voice || morph.middle_voice;
  if (mv && mv !== "none") {
    const mvClean = mv.replace(/_/g, "/").toLowerCase();
    plainParts.push(mvClean);
    htmlParts.push(`<span class="template-middle-voice">${mvClean}</span>`);
  }

  // 4. Root
  const hRoot = morph.h_grade_root || "";
  const gRoot = morph.glottal_grade_root || "";
  let rootStr = hRoot;
  if (gRoot && gRoot !== hRoot) {
    rootStr += ` / ${gRoot}`;
  }
  const commRoot = unrespellConsonants(rootStr) || morph.root || "ROOT";

  plainParts.push(commRoot);
  htmlParts.push(`<strong class="template-root">${commRoot}</strong>`);

  // 5. Post Root Morpheme
  const prmForm = morph.post_root_form || morph.post_root_morpheme;
  if (prmForm) {
    const prmUnrespelled = unrespellConsonants(prmForm);
    plainParts.push(prmUnrespelled);
    htmlParts.push(`<span class="template-post-root">${prmUnrespelled}</span>`);
  }

  // 6. Aspect Class
  const clsName = morph.class_name || "";
  if (clsName) {
    plainParts.push(`[${clsName}]`);
    htmlParts.push(`<span class="template-class">[${clsName}]</span>`);
  }

  return {
    plain: plainParts.join("-"),
    html: htmlParts.join("-"),
  };
}
