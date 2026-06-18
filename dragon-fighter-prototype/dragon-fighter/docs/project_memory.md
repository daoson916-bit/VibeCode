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
- Milestone 3 phase flow is `dragon-select` -> `countdown` -> `active-match` -> `result`.
- Restart keeps the selected dragon and resets HP, timer, cooldowns, labels, latest feedback, AI timers, and result state.
- AI uses the same command path as the player, acts every 2 seconds during active match, prefers Attack when available, and may react defensively after player Skill.
- Dragon images are now manifest-driven local placeholder assets under `public/assets/dragons`.
- Dragon Mania Legends Wiki images are temporary private prototype placeholders only; they must be replaced before public release or deployment unless explicit permission/licensing is confirmed.
- Image loading is handled by an asset store with config-controlled logs, and Canvas shape dragons remain as fallback if a bitmap is missing or fails.
- Arena background art is loaded through the same manifest-driven asset store, with the generated Canvas arena kept as fallback.
