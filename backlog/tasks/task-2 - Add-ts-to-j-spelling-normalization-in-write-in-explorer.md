---
id: TASK-2
title: Add 'ts' to 'j' spelling normalization in write-in explorer
status: Done
assignee:
  - '@antigravity'
created_date: '2026-09-20 18:05'
updated_date: '2026-09-20 18:05'
labels: []
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update normalization in ced-explorer-write-in to replace 'ts' with 'j' so inputs like 'tsi' match 'ji'.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Normalize 'ts' to 'j' in input and target comparisons
- [x] #2 Allow user typing 'tsi' to match 'ji'
- [x] #3 Preserve existing normalization behavior for tones, syllabary, and punctuation
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update normalize() in ced-explorer-write-in/script.js to replace all occurrences of 'ts' with 'j' (case-insensitively).
2. Test that typing 'tsi' matches target 'ji' and vice-versa.
3. Verify existing normalization remains intact.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified that typing 'tsi' matches target 'ji' and complex tone formats via automated test script.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Updated normalize() in ced-explorer-write-in/script.js to convert 'ts' to 'j' during comparison, allowing inputs using 'ts' orthography (such as 'tsi') to match dictionary entries formatted with 'j' (such as 'ji').
<!-- SECTION:FINAL_SUMMARY:END -->
