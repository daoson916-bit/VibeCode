# Dragon Fighter - Current Plan

## Completed

- Consolidated the playable game into repository-root `index.html` with no build system.
- Added a Canvas Main Menu and Play Now transition to Dragon Select.
- Added Ember, Tide, and Moss with config-driven combat modifiers.
- Implemented shared voice, keyboard, and Canvas controls for Attack, Defence, Block, and Ultimate.
- Implemented projectiles, damage resolution, cooldowns, Defence, Block, enemy attacks, timer results, and visual feedback.
- Added stage scaling, enemy rotation, four upgrade paths, and win-to-upgrade progression.
- Added Continue-only win navigation and Retry/Main Menu loss and draw navigation.
- Preserved dragon, stage, and upgrades on retry; reset the complete run on Main Menu.
- Made Ultimate start on full cooldown for every battle and retry.
- Added relative local assets, Canvas fallbacks, GitHub Pages deployment, and six focused flow tests.

## Current Validation

- `node --test tests/game-flow.test.js`
- Inline script syntax check with `node --check`
- Serve repository root and review `/index.html`
- Confirm Main Menu, Dragon Select, combat, win Continue, upgrade, loss Retry, and Main Menu reset.
- Confirm Ultimate is unavailable at battle start and becomes ready when its cooldown reaches zero.

## Next Priorities

1. Replace temporary dragon images with licensed production-safe assets.
2. Add focused tests for damage priority, stage scaling, upgrade formulas, and voice command normalization.
3. Verify microphone permissions and responsive Canvas sizing on target desktop and mobile browsers.
4. Tune combat and progression values from playtest feedback without changing the single-file architecture.

## Not Planned

- Build tooling or a framework migration.
- Online multiplayer, accounts, monetization, persistent progression, movement, or multiple arenas.
