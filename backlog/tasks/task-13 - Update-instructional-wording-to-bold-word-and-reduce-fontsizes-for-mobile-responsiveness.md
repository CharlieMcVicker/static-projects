---
id: TASK-13
title: >-
  Update instructional wording to bold word and reduce fontsizes for mobile
  responsiveness
status: Done
assignee:
  - '@agent'
created_date: '2026-09-21 15:33'
updated_date: '2026-09-21 15:34'
labels: []
dependencies: []
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Fixed text reference from underlined word to bold word in index.html, and reduced font sizes and container paddings across style.css to optimize layout for phone screens.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Instructional text references bold word instead of underlined word
- [x] #2 Font sizes and paddings across cards, header, and buttons are reduced and responsive on mobile
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. In index.html, update 'underlined word' to 'bold word'.
2. In style.css, scale down global font sizes, heading clamps, card paddings, and button dimensions across the board.
3. Add responsive mobile styling (@media (max-width: 600px)) for compact phone screens.
4. Verify rendering and syntax.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified index.html text updated to 'bold word'. Scaled down font sizes and paddings across style.css, and added @media (max-width: 600px) responsive layout.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Updated instructional text to refer to the 'bold word' and reduced font sizes and component paddings across style.css with added mobile media query rules.
<!-- SECTION:FINAL_SUMMARY:END -->
