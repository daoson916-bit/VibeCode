# Dragon Fighter - Current TDD

## Runtime Architecture

- The playable source of truth is repository-root `index.html`.
- HTML, CSS, configuration, state, input, combat, progression, update, and Canvas rendering are inline in that file.
- There is no framework, package manifest, module source tree, build step, or generated deployment directory.
- GitHub Pages deploys the repository root; local assets use relative paths under `dragon-fighter-prototype/dragon-fighter/public/`.

## Main Systems

### Configuration

The `cfg` object owns viewport data, combat values, screen labels/layouts, starting cooldown behavior, dragon modifiers, progression formulas, enemy roster, asset paths, projectile profiles, and control geometry.

### State And Flow

`createInitialState()` creates the in-memory run. Main phases are:

- `menu`
- `select`
- `playing`
- `result`
- `upgrade`

`playNow()`, `confirmDragon()`, `finish()`, `continueAfterWin()`, `retryLastBattle()`, `backToMainMenu()`, and `applyUpgrade()` own transitions. A loss snapshot stores dragon, stage, and upgrades for exact retry. Main Menu recreates initial state and clears voice queue, match effects, selection, upgrades, and progression.

### Combat

- All voice, keyboard, and Canvas inputs call `useCommand()`.
- Attack and Ultimate schedule projectiles; damage resolves when cast plus travel time completes.
- Block negates damage. Defence applies the configured 0.5 multiplier.
- Cooldowns and active timers update each frame and are clamped at zero.
- `initializeCombatCooldowns()` starts Attack, Defence, and Block ready while Ultimate starts at `getCommandCooldown(..., "ultimate")` for every new or retried battle.
- Enemy behavior currently schedules Attack only, using stage-scaled random delays.

### Progression

Dragon modifiers and upgrade ranks feed shared helpers for Attack damage, Defence duration, maximum HP, Block cooldown, and Attack/Ultimate cooldown. Enemy stats derive from stage using configured HP, damage, timing, roster, and scale formulas.

### Rendering And Assets

- One 1400 by 620 Canvas renders every screen and control.
- The game preloads configured images and logs load failures.
- Dragon and arena drawing have Canvas fallbacks.
- PNG projectile images are processed in memory to remove connected light backgrounds; SVG data URI fallbacks remain available.
- Pointer hit regions are rebuilt from the controls drawn for the current phase.

### Voice Input

Web Speech API results are normalized into Attack, Defence, Block, or Ultimate commands. Final results are deduplicated and queued into configured one-second scan windows. Unsupported or denied microphone access leaves Canvas and keyboard controls usable.

## Public Test Surface

`window.DragonFighter` exposes configuration, state, core helpers, and flow functions used by the lightweight tests. It is not a second gameplay implementation.

## Tests

Run:

```powershell
node --test tests/game-flow.test.js
```

The current six tests cover Main Menu entry, Play Now, loss actions, win Continue routing, retry setup restoration, Main Menu reset, and Ultimate starting cooldown. Inline JavaScript can be syntax-checked by extracting the script and running `node --check`; there is no build command.

## Deployment

- Entry point: `/index.html`
- Deployment artifact: repository root
- Workflow: `.github/workflows/pages.yml`
- Required runtime: modern browser with Canvas; Web Speech API is optional

## Known Constraints

- State is not persisted across reloads.
- Voice support and permission behavior vary by browser.
- Current prototype images require replacement before public distribution.
- Automated coverage is focused on navigation and cooldown initialization; combat and progression helpers have residual regression risk.
