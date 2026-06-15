# Dragon Fighter: Egg Spell Forge - TDD

## Purpose

This document describes the current technical shape of the prototype and the next direction. The app is a Canvas-only JavaScript prototype with a working spell-preparation flow and a match preview. The intended combat direction is prepared spell skills only.

## Core Rules For Development

- Keep gameplay, layout, visual, timing, input, AI, and tuning constants in `src/config.js`.
- Render all gameplay UI inside the Canvas.
- Keep `index.html` as only the Canvas/script container.
- Keep logic testable without Canvas, microphone, browser permissions, or real time.
- Keep responsibilities separated: input maps user intent, preparation manages spell creation, spell modules analyze and validate, rendering draws state, combat rules should not draw UI.
- Run tests and build before reporting success.

## Current Source Shape

```text
src/
  config.js
  main.js
  ai/aiController.js
  combat/
    actions.js
    cooldowns.js
    damageResolver.js
    matchRules.js
  core/
    gameLoop.js
    gameState.js
    logger.js
    random.js
    stateMachine.js
  input/inputController.js
  render/renderer.js
  spells/
    patternAnalyzer.js
    spellFactory.js
    spellLoadout.js
    spellRules.js
  states/
    matchState.js
    preparationState.js
  ui/layout.js
test/
  combat.test.js
  match-ai.test.js
  milestone1-shell.test.js
  spell-prep.test.js
```

## Current Runtime States

- `preparation`: default state. Player draws/generates patterns, chooses type, names spells, saves five slots, and confirms loadout.
- `match-preview`: static battle layout after loadout confirmation.
- `countdown`, `active`, `result`: exist for the older combat scaffold and future match flow.

## Current Implemented Systems

### Configuration

`src/config.js` centralizes current tuning for:

- Canvas, colors, fonts, layout.
- Match HP/energy/timer values.
- Spell loadout names and spell types.
- Pattern analysis thresholds.
- Spell costs and preview effects.
- Logging and diagnostics.

It still contains legacy `actions`, `combat`, and basic-action AI values. These support older scaffold code and tests, but are not the target combat design.

### Preparation

`src/states/preparationState.js` owns:

- Adding 9-dot grid points.
- Clearing and randomizing draft patterns.
- Selecting spell type.
- Editing/cycling spell names.
- Saving draft spells.
- Confirming five-slot loadout.

### Spell Logic

- `patternAnalyzer.js`: connections, weight band, energy cost, piercing, closed bonus, crossed-line instability, random pattern generation.
- `spellRules.js`: pattern summary and effect preview text.
- `spellFactory.js`: saved spell object creation.
- `spellLoadout.js`: empty slots, duplicate/similar-name rejection, loadout validation.

### Input

`inputController.js` currently handles:

- Canvas preparation controls.
- Canvas match preview buttons.
- Keyboard name editing in preparation.
- Voice start button.
- Legacy basic action shortcuts and command submission.

Target next step: remove or isolate legacy basic action submission and replace combat input with prepared spell casting.

### Rendering

`renderer.js` currently draws:

- Preparation UI.
- 9-dot grid and drawn draft pattern.
- Spell type buttons and name field.
- Pattern/effect preview.
- Five spell slots.
- Match preview arena, dragons, panels, spell buttons, and legacy basic action controls.

Target next step: remove legacy basic action UI from the target combat screen and make spell buttons the only combat controls.

### Build

- `npm test`: Node test runner.
- `npm run build`: checks HTML stays Canvas-only, syntax-checks JS, and writes ignored `dist/`.
- `npm run dev`: local server on port 5173.
- `dist/` is generated and should not be treated as source.
- Only one docs source folder should exist: `docs/`.

## Known Technical Debt

- Legacy basic action combat still exists in code and tests.
- Voice recognition still submits text to legacy command matching.
- AI still chooses legacy actions.
- Match preview is not yet playable spell combat.
- Some text/config labels still reference commands and should be renamed when legacy combat is removed.
- Renderer is still broad; it can be split later if complexity grows.

## Target Spell Combat Architecture

Next combat work should introduce a spell-casting pipeline separate from the legacy action system:

```text
input attempt -> spell lookup -> validation -> energy spend -> cooldown start -> effect application -> render feedback
```

Validation rules:

- Spell exists in confirmed loadout.
- Match is active.
- Actor is not defeated.
- Enough energy.
- Spell cooldown is ready.
- Voice retry/global voice lockout allows cast.

Effect rules:

- Attack spell damages opponent.
- Defense spell creates shield.
- Support spell heals.
- Control spell slows.
- Utility spell gives movement/energy feedback.
- Shield absorbs damage before HP; piercing bypasses part of shield.

## Test Coverage Now

Current tests cover:

- Legacy basic action mapping/combat scaffold.
- Countdown/result pieces from old match scaffold.
- Initial state and layout helpers.
- Pattern analysis.
- Spell creation and loadout validation.
- Preparation flow and name-editing separation from basic actions.

Next tests should cover:

- Spell-name mapping.
- Spell cast validation.
- Energy spend/regen/clamp.
- Spell cooldowns.
- Voice retry/global lockout.
- Five spell type effects.
- Shield/piercing damage resolution.
- AI spell choice.
- Commands/spells ignored outside active match.
- Restart and return-to-preparation reset.
