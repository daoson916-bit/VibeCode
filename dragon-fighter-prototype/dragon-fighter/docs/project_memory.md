# Project Memory

## Stable Decisions

- The active Dragon Fighter project lives in `dragon-fighter-prototype/dragon-fighter`.
- Milestone 1 is a static Canvas-only battle screen; no real command handling or combat is implemented yet.
- All gameplay, timing, UI, render, logging, server, and build tunables are centralized in `src/config.js`.
- HTML stays minimal: it contains only the Canvas, basic page sizing CSS, and the module script.
- The initial state labels for both dragons are `Idle`.
- Command vocabulary for the prototype is exactly `Attack`, `Defence`, `Block`, and `Skill`.
- Milestone 1 now starts with a Canvas-only Dragon Select phase before the static arena.
- Dragon Select has exactly three display-only dragons: Ember, Tide, and Volt. Their future modifiers are config placeholders only and do not affect combat yet.
- Milestone 2 uses one shared command path for keyboard and Canvas button inputs.
- Dragon role modifiers remain display/config placeholders only; Attack, Defence, Block, Skill values still come from base action config.
- The post-select arena phase `static-arena` is the active combat phase until Milestone 3 adds countdown and match states.
