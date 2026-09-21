---
id: TASK-6
title: >-
  Expand CED Explorer Classes dataset to include all 595 verbs from
  hierarchical-dict.json
status: Done
assignee:
  - '@antigravity'
created_date: '2026-09-21 15:08'
updated_date: '2026-09-21 15:09'
labels: []
dependencies: []
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The initial data build filtered out verbs that lacked audio sentence matches, yielding only 291 verbs. All 595 verbs from hierarchical-dict.json must be preserved in the dataset with their morphological templates, reconstructed forms, and quizzable structures.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 build_data.py exports all 595 verbs from hierarchical-dict.json into dict_verbs.js
- [x] #2 All 595 verbs have valid target forms (present, 1sg, past, habitual, imperative, infinitive) and templates
- [x] #3 Verbs without explicit corpus audio sentences have functional sentence/prompt fallbacks so they work seamlessly in both quiz modes
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update build_data.py to iterate through all 595 verbs in hierarchical-dict.json without dropping entries missing corpus sentences.
2. For verbs with segmented_forms, compute or map all 6 standard forms (present, 1sg, past, habitual, imperative, infinitive), simple romanization, and syllabary.
3. For verbs without external corpus example sentences, generate a standardized prompt sentence (e.g. definition / target verb with asterisk delimiters) so quiz rendering and filtering works reliably.
4. Run build_data.py and verify all 595 verbs are present and valid in dict_verbs.js.
5. Verify application behavior with node and frontend checks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Updated build_data.py to ingest corpus.csv and hierarchical-dict.json. Verified all 595 verbs are present with complete templates, 6 principal forms, simple strings, syllabary, and quizzable sentence structures.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Expanded build_data.py to ingest all 595 analyzed verbs from hierarchical-dict.json and data/corpus.csv, synthesizing complete 6-form paradigm fields, syllabary, and morphological template formulas so that all 595 verbs are fully quizzable in both practice modes.
<!-- SECTION:FINAL_SUMMARY:END -->
