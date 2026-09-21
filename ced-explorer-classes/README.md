# CED Explorer Classes & Practice

An interactive learning and exploration tool for Cherokee English Dictionary (CED) verbs, morphological classes, and templates.

## Features

- **Morphological Template Header**: Prominently displays the reconstructed linguistic formula (e.g. `Set A-at-ad-[eg-invs]`) above each example sentence, featuring:
  - Colored pronoun sets (Set A in red, Set B in blue)
  - Bolded community orthography roots
  - Prefixes (`wi`, `ni`, `te`), middle voice morphemes, and post-root morphemes
  - Aspect class brackets (e.g. `[i-a-i]`, `[eg-invs]`)
- **Dual Practice Modes (Pill Toggle Switcher)**:
  - **Multiple Choice Mode** (Default): Quiz mode displaying 4 Cherokee verb options with instant feedback, English translations, and links to the full Cherokee English Dictionary.
  - **Write-In Practice Mode**: Type-in practice with tone-insensitive normalization, instant evaluation, answer reveal, and detailed breakdowns.
- **Filter Settings**: Filter by target form (Third present, First present, Habitual, Imperative, Infinitive, Past, or Random) and toggle audio-only sentences.
- **Data Build & Update Pipeline**: Includes `build_data.py` to easily regenerate and align verb data from `hierarchical-dict.json`, `data/classes.csv`, and `data/post_root_morphemes.csv`.

## Updating Dictionary Data

Whenever `hierarchical-dict.json`, `data/classes.csv`, or `data/post_root_morphemes.csv` are updated:

```bash
python3 build_data.py
```

This will automatically refresh `dict_verbs.js` with updated morphological templates and aligned sentence audio.
