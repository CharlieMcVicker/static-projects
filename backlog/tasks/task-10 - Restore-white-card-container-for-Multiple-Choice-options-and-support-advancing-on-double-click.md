---
id: TASK-10
title: >-
  Restore white card container for Multiple Choice options and support advancing
  on double click
status: Done
assignee:
  - '@agent'
created_date: '2026-09-21 15:23'
updated_date: '2026-09-21 15:24'
labels: []
dependencies: []
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Users noted that the options section lost its white card outline and background, causing rough color contrast against the page background. Also, double-clicking or clicking the already-correct choice should advance to the next card.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The options section (.options-wrapper) has a white card background, solid black border, and shadow matching other cards
- [x] #2 Correct option button highlights with clean green success styling
- [x] #3 Double-clicking or clicking the correct option when already answered advances immediately to the next word
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add card styling (white background, border, border-radius, box-shadow, padding) to .options-wrapper in style.css.
2. Polish .choice-option-btn.btn-correct colors for clear, pleasant success state.
3. In script.js, update choice option button handling so double clicking or clicking an already-correct button triggers nextWord().
4. Test interactions and verify.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified .options-wrapper matches card container styling with solid 3px border, 4px shadow, and clean white background. Styled correct state with pleasant #dcfce7 background and #16a34a border. Updated renderChoiceOptions with both dblclick and answered re-click advancing.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Restored white card container styling to .options-wrapper, refined button correct/incorrect contrast colors, and enabled double-clicking or re-clicking the correct choice to advance to the next card.
<!-- SECTION:FINAL_SUMMARY:END -->
