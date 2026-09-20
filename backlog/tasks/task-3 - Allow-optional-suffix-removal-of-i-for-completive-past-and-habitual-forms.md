---
id: TASK-3
title: Allow optional suffix removal of 'i for completive past and habitual forms
status: Done
assignee:
  - '@antigravity'
created_date: '2026-09-20 18:06'
updated_date: '2026-09-20 18:07'
labels: []
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
For third completive past and third present habitual forms, allow matching when the user optionally omits the trailing 'i or i suffix.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 For third_completive_past and third_incompletive_habitual, match if user omits final 'i or i
- [x] #2 Allow inputs with or without final 'i / i to match
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update handleCheck in ced-explorer-write-in/script.js to generate candidates for both full form and form without trailing 'i / i / Ꭲ when currentForm is third_completive_past or third_incompletive_habitual.
2. Verify that typing with or without final 'i / i matches successfully.
3. Test edge cases across dictionary verbs.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified that typing with or without trailing 'i / i / Ꭲ matches for third completive past and third habitual forms, while preserving exact ending validation for other forms.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Updated handleCheck() in ced-explorer-write-in/script.js to allow optional omission of trailing 'i / i (and final Ꭲ in Syllabary) for third completive past and third present habitual forms.
<!-- SECTION:FINAL_SUMMARY:END -->
