---
id: TASK-11
title: Update distributive prefix spelling from te to de in morphological templates
status: Done
assignee:
  - '@agent'
created_date: '2026-09-21 15:29'
updated_date: '2026-09-21 15:29'
labels: []
dependencies: []
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Old spelling convention used te for the distributive prefix. Modern Cherokee orthography and community standards use de. Update template generators in build_data.py and template_formatter.js, and rebuild dict_verbs.js.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 template_formatter.js formats distributive prefix as de
- [x] #2 build_data.py formats distributive prefix as de
- [x] #3 dict_verbs.js is regenerated with de for distributive prefix
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Replace 'te' with 'de' for distributive prefix in template_formatter.js.
2. Replace 'te' with 'de' for distributive prefix in build_data.py.
3. Run build_data.py to regenerate dict_verbs.js.
4. Verify templates in dict_verbs.js have 'de' for distributive verbs and no unwanted regressions.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified that template_formatter.js and build_data.py both format pre.distributive as 'de'. Successfully regenerated dict_verbs.js containing 'de-' prefixes on all distributive verbs.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Updated distributive prefix representation from 'te' to 'de' in template_formatter.js and build_data.py, and regenerated dict_verbs.js.
<!-- SECTION:FINAL_SUMMARY:END -->
