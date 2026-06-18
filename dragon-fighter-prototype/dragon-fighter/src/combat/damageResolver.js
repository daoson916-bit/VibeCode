export function resolveIncomingDamage(config, targetSide, incomingDamage) {
  if (targetSide.activeEffects[config.actions.blockCommandWord] > config.math.zero) {
    return config.math.zero;
  }

  if (targetSide.activeEffects[config.actions.defenceCommandWord] > config.math.zero) {
    return incomingDamage * config.actions.defenceDamageMultiplier;
  }

  return incomingDamage;
}

export function clampHp(config, hp) {
  return Math.max(config.match.minHp, hp);
}
