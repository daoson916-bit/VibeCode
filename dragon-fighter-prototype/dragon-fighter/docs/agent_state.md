# Agent State

## Current Milestone

Milestone 2 - Command-to-Combat Loop.

## Completed This Turn

- Added a Canvas-only Dragon Select phase before the static arena.
- Added exactly three config-driven dragon options: Ember, Tide, and Volt.
- Added pointer selection and confirm flow with blocked-confirm feedback.
- Updated static arena state so the selected dragon becomes Player 1's arena dragon.
- Added tests for config dragon options, selection, blocked confirm, successful transition, selected dragon data, idle labels, and layout data.
- Verified tests/build pass.
- Verified the dev server responds at `http://localhost:5173`.
- Browser verification is blocked by sandbox ACL errors when loading the in-app Browser plugin client.
- Added command mapping for Attack, Defence, Block, and Skill.
- Added keyboard input and Canvas combat buttons using one shared command path.
- Added command validation, cooldowns, active Defence and Block durations, damage resolution, HP updates/clamping, state labels, and latest command feedback.
- Added tests for command mapping, shared input mapping, cooldowns, damage rules, damage priority, HP clamp, defeated/inactive rejection, and feedback.

## Next Action

Begin Milestone 3 - Complete AI Match, Result Flow, and Shareable Build: add countdown, active match timer, AI action scheduling, result rules, restart flow, final browser verification, and deployment setup.
