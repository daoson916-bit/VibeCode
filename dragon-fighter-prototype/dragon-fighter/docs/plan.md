# Dragon Fighter: Egg Spell Forge - Plan

## Current Status

Completed:

- Canvas-only shell and static match preview.
- Central config and separated modules.
- Spell preparation flow:
  - 9-dot pattern drawing.
  - Random pattern generation.
  - Spell type selection.
  - Name editing and cycling.
  - Weight, cost, pierce, bonus, and instability preview.
  - Duplicate and similar-name rejection.
  - Five-slot loadout confirmation.
- Source-only docs folder. `dist/` is generated and ignored.

Important decision:

- Combat design changed to prepared spell skills only.
- Legacy basic actions remain in code and tests as scaffold debt, but they are no longer the target design.

## Milestone 1 - Done

Canvas shell, preparation layout, match preview layout, config, state, logging, tests, and build baseline.

## Milestone 2 - Done

Egg spell forge preparation flow and five-spell loadout confirmation.

## Next Milestone - Spell Combat Refactor And Casting Loop

Goal: replace legacy basic-action combat with prepared spell skill combat.

Scope:

- Remove basic action combat from the target UI and input path.
- Map full spell names and spell buttons into one casting pipeline.
- Use the confirmed loadout as the available combat skill set.
- Validate active match state, defeated state, energy, cooldown, voice retry, and voice lockout.
- Spend energy and start spell cooldowns.
- Apply Attack, Defense, Support, Control, and Utility effects.
- Implement shield, piercing, and HP resolution.
- Show state labels, latest spell feedback, effect cues, energy, and cooldown changes.

Tests:

- Spell name mapping.
- Canvas spell button mapping.
- Energy spend, shortage, regeneration, and clamping.
- Spell cooldown success and failure.
- Voice retry and global lockout.
- Attack, Defense, Support, Control, and Utility effects.
- Shield and piercing.
- HP clamping.
- Ignored casts outside active match.

## Later Milestone - Full Match

Goal: complete a playable match loop.

Scope:

- Countdown into active match.
- 60-second timer.
- AI spell loadout and AI spell decisions.
- Win, lose, and draw by HP and energy tiebreakers.
- Result overlay.
- Restart and return to preparation.
- Deployment instructions or GitHub Pages setup.

## Acceptance For Current Prototype

- `npm run check` passes.
- App runs at `http://localhost:5173`.
- User can create, save, and confirm five spells.
- Confirmed loadout appears in the match preview.
- Docs reflect current implementation, current direction, and known debt.
