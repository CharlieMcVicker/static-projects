---
id: TASK-14
title: >-
  Stack h and glottal verb roots vertically in morphological template headers
  and trigger audio on correct answers
status: Done
assignee:
  - '@agent'
created_date: '2026-09-21 15:35'
updated_date: '2026-09-21 15:36'
labels: []
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
When a verb has distinct h-grade and glottal-grade roots, stack them vertically with the h-grade root on top in the template formula header. Also trigger audio playback when the user answers correctly.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Template header displays h-root over glottal-root in a vertical stack when distinct
- [x] #2 build_data.py and template_formatter.js generate stacked root markup
- [x] #3 Selecting correct answer plays the sentence audio
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update build_data.py to format distinct h-grade and glottal-grade roots with h on top in a vertical stack wrapper (.template-root-stacked).
2. Update template_formatter.js to format distinct h-grade and glottal-grade roots identically.
3. Update style.css to render .template-root-stacked vertically with clear typography.
4. Regenerate dict_verbs.js.
5. In script.js, trigger audio playback of the sentence when answering correctly (both Multiple Choice and Write-In modes).
6. Verify and test.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified .template-root-stacked renders vertically with h-root on top. Regenerated dict_verbs.js containing stacked HTML markup for dual-root verbs. Wired playCurrentSentenceAudio() on correct answers for both Multiple Choice and Write-In modes.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Stacked distinct h-grade and glottal-grade roots vertically in template header with h-root on top, and automatically trigger sentence audio playback when selecting or checking the correct answer.
<!-- SECTION:FINAL_SUMMARY:END -->
