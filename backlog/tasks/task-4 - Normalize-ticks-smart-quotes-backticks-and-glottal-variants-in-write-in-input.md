---
id: TASK-4
title: >-
  Normalize ticks, smart quotes, backticks, and glottal variants in write-in
  input
status: Done
assignee:
  - '@antigravity'
created_date: '2026-09-20 18:09'
updated_date: '2026-09-20 18:09'
labels: []
dependencies: []
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update normalize() in ced-explorer-write-in to comprehensively strip all varieties of ticks (apostrophes, curly single/double quotes, backticks, modifier apostrophes, acute accents) and glottal stop characters from both input and dictionary forms.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Normalize ASCII apostrophes, smart/curly quotes (’, ‘, ”, “), backticks (`), acute accents (´), and modifier apostrophes (ʼ, ʻ, ʽ)
- [x] #2 Normalize all glottal stop notations (Ɂ, ɂ, ʔ, ?)
- [x] #3 Allow inputs with any tick/quote/glottal variations to match
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Expand normalize() regex in ced-explorer-write-in/script.js to strip all varieties of ticks (', `, ’, ‘, ʼ, ʻ, ʽ, ´, ^, ", ”, “), glottal stop characters (Ɂ, ɂ, ʔ, ?), and general punctuation before and during normalization.
2. Ensure input trimming and suffix stripping continue to work seamlessly with any tick formats.
3. Test edge cases across multiple word forms.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified comprehensive tick, smart quote, backtick, accent, and glottal mark normalization across dictionary entries and edge-case inputs via automated tests.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Expanded normalize() in ced-explorer-write-in/script.js to strip all forms of ticks, smart/curly quotes (', `, ’, ‘, ”, “), modifier apostrophes (ʼ, ʻ, ʽ), acute accents (´), and glottal stop characters (Ɂ, ɂ, ʔ, ?) across inputs and dictionary words.
<!-- SECTION:FINAL_SUMMARY:END -->
