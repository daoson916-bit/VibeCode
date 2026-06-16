import { CONFIG } from '../config.js';

export function updateFeedbackTimers(side, deltaSeconds, config = CONFIG) {
  side.actionLabelSeconds = Math.max(config.match.minHp, side.actionLabelSeconds - deltaSeconds);
  side.failedLabelSeconds = Math.max(config.match.minHp, side.failedLabelSeconds - deltaSeconds);
}

// Spell cooldown management

/**
 * Checks if a spell is off cooldown and ready to cast.
 * @param {Object} spell - The spell object.
 * @param {Object} config - Configuration object.
 * @returns {boolean} True if cooldownRemaining <= 0.
 */
export function isSpellReady(spell, config = CONFIG) {
  return (spell.cooldownRemaining ?? config.match.minHp) <= config.match.minHp;
}

/**
 * Starts a spell cooldown with optional multiplier (for voice vs button).
 * @param {Object} spell - The spell object.
 * @param {number} baseCooldown - Base cooldown duration in seconds.
 * @param {number} multiplier - Multiplier (e.g., 1.0 for voice, 1.5 for button).
 * @param {Object} config - Configuration object.
 */
export function startSpellCooldown(spell, baseCooldown, multiplier = 1.0, config = CONFIG) {
  spell.cooldownRemaining = baseCooldown * multiplier;
}

/**
 * Ticks down all spell cooldowns for an actor's loadout.
 * @param {Object} actor - The actor with spellLoadout array.
 * @param {number} deltaSeconds - Time elapsed since last update.
 * @param {Object} config - Configuration object.
 */
export function updateSpellCooldowns(actor, deltaSeconds, config = CONFIG) {
  if (!actor.spellLoadout || !Array.isArray(actor.spellLoadout)) {
    return;
  }
  actor.spellLoadout.forEach((spell) => {
    if (spell && typeof spell === 'object') {
      spell.cooldownRemaining = Math.max(
        config.match.minHp,
        (spell.cooldownRemaining ?? config.match.minHp) - deltaSeconds
      );
    }
  });
}
