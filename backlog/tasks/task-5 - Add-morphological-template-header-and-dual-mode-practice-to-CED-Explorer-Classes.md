---
id: TASK-5
title: >-
  Add morphological template header and dual-mode practice to CED Explorer
  Classes
status: Done
assignee:
  - '@antigravity'
created_date: '2026-09-21 15:03'
updated_date: '2026-09-21 15:06'
labels: []
dependencies: []
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Users practicing CED verb morphology need to see the structural morphological template (prefixes, pronoun set, root, post-root morpheme, and aspect class) as a header above example sentences, and want the ability to switch between multiple-choice practice and write-in typing practice. A repeatable build script is also needed to update templates from hierarchical-dict.json and morpheme definitions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Data build script in ced-explorer-classes processes hierarchical-dict.json and morphemes to generate aligned verb data and template formulas
- [x] #2 Morphological template header is rendered above example sentences with colored pronoun sets, bold root, and class brackets
- [x] #3 Top tab/pill toggle enables switching between Multiple Choice (default) and Write-In practice modes without page reload
- [x] #4 Multiple Choice mode supports interactive quiz options with feedback and CED links
- [x] #5 Write-In mode provides tone-insensitive answer checking, Reveal Answer, and detailed answer feedback
- [x] #6 Settings for target form selection and audio-only filtering work seamlessly in both modes
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Build python data processor (build_data.py) to ingest hierarchical-dict.json and post_root_morphemes.csv, precompute template parts and generate dict_verbs_classes.js.
2. Port morphological template generator and community orthography unrespelling logic to JavaScript.
3. Update HTML structure in ced-explorer-classes/index.html with top mode switcher (Multiple Choice / Write-In), template header, and write-in input/feedback containers.
4. Modularize and enhance script.js and style.css in ced-explorer-classes to support both Multiple Choice and Write-In modes with seamless switching.
5. Verify all acceptance criteria with local node/browser checks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified data pipeline with build_data.py creating 291 verbs with precomputed templates, sentences, and audio. Verified JS orthography and template formatting modules. Verified index.html, style.css, and script.js supporting dual mode switching and template headers.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented repeatable data build pipeline (build_data.py), added morphological template formula header badge above sentence cards, ported full write-in practice mode from ced-explorer-write-in, and added smooth top pill-tab mode switcher between Multiple Choice and Write-In modes.
<!-- SECTION:FINAL_SUMMARY:END -->
