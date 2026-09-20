---
id: TASK-1
title: Create CED explorer write-in game
status: Done
assignee:
  - '@antigravity'
created_date: '2026-09-20 18:00'
updated_date: '2026-09-20 18:01'
labels: []
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Copy ./ced-explorer to ./ced-explorer-write-in and adapt the game to use open write-in responses (without tone markings) instead of multiple choice.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Copy ced-explorer to ced-explorer-write-in
- [x] #2 Display sentence (syllabary, phonetics, and audio if available) and the target form to produce
- [x] #3 Provide a text input for typing the response without tone markings
- [x] #4 Validate typed response against target form (e.g. simple phonetics/latin or normalized target form) and provide feedback with translation/CED link
- [x] #5 Support Next button/Enter key to advance to the next prompt
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Copy ./ced-explorer to ./ced-explorer-write-in using cp -r.
2. Update index.html in ced-explorer-write-in to replace multiple choice options with an open write-in input form (input field, submit button, feedback area, reveal button, and clear target form display).
3. Update script.js in ced-explorer-write-in to:
   - Present the prompt sentence (syllabary, phonetics, audio).
   - Prominently display the target grammatical form to produce (e.g. 'First person present').
   - Handle open write-in text input without tone markings.
   - Implement robust normalization (lowercasing, trimming, stripping tone numbers 1-4, diacritics/underdots, hyphens, glottal stops) comparing against both simple romanization and syllabary.
   - Provide clear feedback for correct/incorrect attempts, reveal definition, formatted tone representations, sentence English translation, and CED link.
   - Support keyboard navigation (Enter key to submit or advance).
   - Fix audio checkbox filtering to use .checked.
4. Update style.css in ced-explorer-write-in to style the write-in input, prompt, buttons, and feedback states cleanly and responsively.
5. Test functionality thoroughly across various forms, audio filtering, and input submissions.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified syntax via node --check. Verified dictionary coverage, audio filtering, normalization functions, and event flows across all 6 grammatical forms.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Copied ced-explorer to ced-explorer-write-in and updated the game into an open-response write-in format. The app presents the prompt sentence in Syllabary and phonetics with optional audio playback, clearly displays the target grammatical form to produce, accepts open write-in text responses without requiring tone marks, provides immediate validation and rich answer breakdown with dictionary links, and supports smooth keyboard navigation.
<!-- SECTION:FINAL_SUMMARY:END -->
