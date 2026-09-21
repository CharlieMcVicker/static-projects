---
id: TASK-8
title: >-
  Join authoritative CED source by entry_no in build_data.py, remove
  transliterator fallback, and fail unvalidated verbs
status: Done
assignee:
  - '@antigravity'
created_date: '2026-09-21 15:18'
updated_date: '2026-09-21 15:20'
labels: []
dependencies: []
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
To guarantee 100% linguistic accuracy for learners, build_data.py must pull authentic Cherokee syllabary, tone markings, and full 6-part paradigms directly from the curated CED dictionary dataset (keyed by entry_no). All custom regex phonetic transliteration fallbacks are removed. Any verb without verified curated dictionary forms is dropped rather than populated with synthetic/hacky fallback data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All custom regex phonetic-to-syllabary transliterators and heuristic form synthesis fallbacks are removed from build_data.py
- [x] #2 Authentic Cherokee syllabary and diacritic tone markings for all 6 principal forms are loaded from curated CED/CND dictionary records matched by entry_no
- [x] #3 Verbs lacking authentic curated dictionary forms and sentences are cleanly omitted
- [x] #4 Every verb in dict_verbs.js has authentic Cherokee syllabary and correct tone-marked romanization
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Copy curated CND/CED dictionary source (cnd/dictionary.csv / full_dict_raw.txt) into data/ directory.
2. Refactor build_data.py to index curated CED dictionary rows by entry_no, extracting authentic syllabary, tone-marked forms, and simple romanization for all 6 forms (present, 1sg, past, habitual, imperative, infinitive).
3. Remove PHONETIC_TO_SYLLABARY_MAP and phonetics_to_syllabary completely.
4. Drop/fail any verb from hierarchical-dict.json that does not have valid authentic curated dictionary data or example sentences.
5. Regenerate dict_verbs.js and run strict validation checks ensuring 100% of entries contain genuine syllabary and tone markings.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Removed all regex transliterators and fallback heuristics. Verified that 312 verbs matching authoritative curated CED entries with authentic syllabary, tone numbers, and complete sentences are exported, and all unverified entries are omitted.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Refactored build_data.py to strictly require curated CED dictionary matches with authentic Cherokee syllabary, CED tone numbers, and complete sentences. Removed all phonetic-to-syllabary fallback transliterators and synthetic data generators.
<!-- SECTION:FINAL_SUMMARY:END -->
