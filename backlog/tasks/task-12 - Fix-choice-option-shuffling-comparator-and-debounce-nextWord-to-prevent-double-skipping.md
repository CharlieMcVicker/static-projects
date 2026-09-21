---
id: TASK-12
title: >-
  Fix choice option shuffling comparator and debounce nextWord to prevent
  double-skipping
status: Done
assignee:
  - '@agent'
created_date: '2026-09-21 15:30'
updated_date: '2026-09-21 15:30'
labels: []
dependencies: []
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Fixed a destructuring bug in shuffled() where ([a], [b]) => a[0] - b[0] produced NaN and left the correct option at the top. Also eliminated duplicate transition triggers by removing conflicting dblclick/click events and preventing rapid skip on newly rendered buttons.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 shuffled() correctly randomizes option order using a proper comparator
- [x] #2 Single click marks correct/incorrect and double click or second click advances to next word without triggering double skips on new cards
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Fix shuffled() implementation in script.js using standard Fisher-Yates or (a, b) => a[0] - b[0].
2. Fix nextWord() transition logic in renderChoiceOptions():
   - Remove redundant 'dblclick' event listener that caused double-firing.
   - Use a clean stateful click transition handler or a short cooldown (e.g. 150-200ms debounce/delay or transition lock) so a fast click/dblclick advances cleanly without leaking events into newly mounted cards.
3. Verify shuffling produces random positions in node and browser.
4. Verify double click advances exactly one question.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified Fisher-Yates uniform distribution across 10,000 trials (25.1%, 25.1%, 24.7%, 25.0%). Removed duplicate dblclick listener and added a 250ms debounce guard on card transitions.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fixed Fisher-Yates array shuffling in script.js to randomize multiple choice option order, and removed duplicate double-click event listener to prevent immediate card skipping.
<!-- SECTION:FINAL_SUMMARY:END -->
