# Dragon Fighter - Current GDD

## Pitch

Dragon Fighter is a short Canvas-based dragon dueling game. The player chooses one of three dragons, issues combat commands by voice, keyboard, or Canvas buttons, and advances through increasingly strong AI opponents by selecting upgrades after victories.

## Design Pillars

- **Voice first, not voice only:** spoken commands are the primary fantasy; buttons and keys provide reliable fallbacks.
- **Decisions over movement:** combat is about command timing, cooldowns, Defence, and Block rather than positioning.
- **Readable feedback:** HP, cooldowns, states, accepted commands, projectiles, and results remain visible in one arena view.
- **Short progression runs:** wins lead to an upgrade and a stronger stage; losses allow an exact retry or a clean return to the Main Menu.

## Current Flow

1. Main Menu: **Play Now**.
2. Dragon Select: choose Ember, Tide, or Moss and confirm.
3. Combat: fight the stage opponent for up to 60 seconds.
4. Result:
   - Win: **Continue** to the upgrade screen, choose one upgrade, then begin the next stage.
   - Lose or Draw: **Retry Match** with the same dragon, stage, and upgrades, or **Back to Main Menu** to reset the run.
5. Changing dragon from the upgrade screen also starts a fresh run.

## Dragons

- **Ember - Attack Focus:** 1.20x Attack damage, 0.85x Defence duration, normal Skill cooldown.
- **Tide - Defence Focus:** 0.90x Attack damage, 1.25x Defence duration, normal Skill cooldown.
- **Moss - Balanced:** normal Attack and Defence, 0.95x Skill cooldown.

## Combat Rules

- Player base HP: 100. Vitality upgrades increase maximum HP.
- Match time: 60 seconds.
- **Attack:** 12 base damage, 1 second base cooldown.
- **Defence:** reduces incoming damage by 50% for 3 seconds, 4 second cooldown.
- **Block:** prevents all incoming damage for 1 second, 7 second base cooldown.
- **Ultimate / Skill:** 35 base damage, 9 second base cooldown.
- Ultimate starts on its full normal cooldown at the beginning of every battle and retry.
- Block takes priority over Defence when an enemy projectile lands.
- The AI attacks automatically at a stage-scaled random interval.
- Reaching 0 HP loses; defeating the opponent wins. At timeout, higher HP wins and equal HP draws.

## Progression

- Each win increments the victory count and unlocks one upgrade choice.
- **Power:** +10% Attack and Ultimate damage per rank.
- **Vitality:** +12 maximum HP per rank.
- **Guard:** +0.2 seconds Defence duration and -0.25 seconds Block cooldown per rank.
- **Focus:** -5% Attack and Ultimate cooldowns per rank, with a configured floor.
- Later stages increase enemy HP and damage, shorten attack intervals, and rotate through configured enemy identities.

## Controls

- Voice: Attack, Defence/Defense, Block, Ultimate, or Skill.
- Canvas: microphone toggle and all four combat commands.
- Keyboard: `A`, `D`, `B`, `U`; `R` restarts the active battle; `Enter` confirms menu/result steps; number keys choose upgrades.

All input methods call the same command path and obey the same phase and cooldown rules.

## Presentation

- All player-facing UI is drawn inside a 1400 by 620 Canvas.
- Local arena, dragon, and projectile assets are used with Canvas fallbacks for missing dragon/background images.
- Projectiles, shields, particles, screen shake, status labels, and cooldown indicators provide combat feedback.

## Scope Boundaries

- No movement, aiming, online multiplayer, accounts, monetization, or persistent save system.
- The run exists only in memory and resets on page reload or Main Menu reset.
- Current dragon images are temporary prototype assets and must be replaced with licensed production-safe assets before public release.
