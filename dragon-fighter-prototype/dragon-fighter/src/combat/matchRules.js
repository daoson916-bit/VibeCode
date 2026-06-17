import { CONFIG } from '../config.js';
import { markDefeatedSides } from '../core/gameState.js';

export function chooseResult(state, config = CONFIG) {
  const player = state.sides[config.match.playerId];
  const ai = state.sides[config.match.aiId];

  if (player.hp <= config.match.minHp && ai.hp <= config.match.minHp) {
    return { label: config.match.drawLabel, reason: 'Both sides were defeated.' };
  }

  if (ai.hp <= config.match.minHp) {
    return { label: config.match.winLabel, reason: 'The AI dragon was defeated.' };
  }

  if (player.hp <= config.match.minHp) {
    return { label: config.match.loseLabel, reason: 'Player 1 dragon was defeated.' };
  }

  if (state.matchRemaining <= config.match.minHp) {
    return { label: config.match.drawLabel, reason: 'Time expired with both sides still standing.' };
  }

  return null;
}

export function endMatchIfNeeded(state, logger, config = CONFIG) {
  markDefeatedSides(state, config);
  const result = chooseResult(state, config);
  if (!result) return false;
  state.phase = config.match.resultPhase;
  state.result = result.label;
  state.resultReason = result.reason;
  logger?.info('Match ended', result);
  return true;
}
