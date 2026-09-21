---
id: TASK-7
title: >-
  Implement dual-factor linguistic matching in build_data.py to eliminate ID
  collision junk
status: Done
assignee:
  - '@antigravity'
created_date: '2026-09-21 15:11'
updated_date: '2026-09-21 15:13'
labels: []
dependencies: []
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
In build_data.py, dictionary keys from scraped files were improperly joined against corpus_id and entry_no, resulting in mismatched definitions and Cherokee surface forms. We must unsegment and unrespell ground-truth forms from hierarchical-dict.json and join audio sentences only with dual-factor (definition and Cherokee stem) agreement.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 build_data.py unsegments and unrespells ground-truth forms directly from hierarchical-dict.json for all 595 verbs
- [x] #2 Audio sentences from external datasets are attached only when both definition and Cherokee surface stem agree
- [x] #3 Verbs without verified audio use clean synthesized prompts based strictly on their own definition and forms
- [x] #4 Zero false-positive collisions (such as dekayvsgwoiha on asul) exist in dict_verbs.js
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Refactor build_data.py to remove all raw integer/key ID joins between external scraped files and hierarchical-dict.json.
2. Implement robust unsegmenting and unrespelling for all 6 segmented forms in hierarchical-dict.json as the single source of truth for surface forms.
3. Build a dual-factor matching function (normalized definition AND surface Cherokee stem similarity) to attach external sentences and audio with zero false positives.
4. Regenerate dict_verbs.js and verify all 595 entries have matching definitions, templates, and surface forms.
5. Check specific test cases (e.g. asulo vs dekayvsgwoiha) to verify zero collisions.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Eliminated raw ID joins against external scraped files. Implemented dual-factor verification (normalized definition AND surface stem agreement). Verified all 595 verbs in dict_verbs.js have 0 false-positive collisions.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Resolved ID alignment collisions by making hierarchical-dict.json and linguistic corpus unsegmenting the ground truth for all 595 verbs, and requiring dual-factor (definition and Cherokee stem) agreement to attach external audio sentences.
<!-- SECTION:FINAL_SUMMARY:END -->
