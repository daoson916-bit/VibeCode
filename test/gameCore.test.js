const test = require("node:test");
const assert = require("node:assert/strict");
const {
  GAME_CONFIG,
  createInitialState,
  getSelectedDragon,
  modifiedAttackDamage,
  modifiedDefenceDuration,
  modifiedSkillCooldown,
  getBattleRenderData
} = require("../src/gameCore");

test("exactly three dragons have modifier config", () => {
  assert.equal(GAME_CONFIG.dragons.length, 3);

  GAME_CONFIG.dragons.forEach((dragon) => {
    assert.ok(dragon.name);
    assert.ok(dragon.role);
    assert.ok(dragon.flavor);
    assert.ok(dragon.asset);
    assert.equal(typeof dragon.modifiers.attackDamage, "number");
    assert.equal(typeof dragon.modifiers.defenceDuration, "number");
    assert.equal(typeof dragon.modifiers.skillCooldown, "number");
  });
});

test("selected dragon modifier is stored through state selection", () => {
  const state = createInitialState(GAME_CONFIG);
  state.selectedDragonId = "tide";

  const selected = getSelectedDragon(GAME_CONFIG, state);
  assert.equal(selected.id, "tide");
  assert.equal(selected.modifiers.defenceDuration, 1.25);
});

test("Attack Focus increases Attack damage", () => {
  const state = createInitialState(GAME_CONFIG);
  state.selectedDragonId = "ember";

  assert.equal(modifiedAttackDamage(GAME_CONFIG, state), 14);
  assert.ok(modifiedAttackDamage(GAME_CONFIG, state) > GAME_CONFIG.baseAttackDamage);
});

test("Attack Focus reduces Defence duration", () => {
  const state = createInitialState(GAME_CONFIG);
  state.selectedDragonId = "ember";

  assert.equal(modifiedDefenceDuration(GAME_CONFIG, state), 2.55);
  assert.ok(modifiedDefenceDuration(GAME_CONFIG, state) < GAME_CONFIG.baseDefenceTime);
});

test("Defence Focus increases Defence duration", () => {
  const state = createInitialState(GAME_CONFIG);
  state.selectedDragonId = "tide";

  assert.equal(modifiedDefenceDuration(GAME_CONFIG, state), 3.75);
  assert.ok(modifiedDefenceDuration(GAME_CONFIG, state) > GAME_CONFIG.baseDefenceTime);
});

test("Defence Focus reduces Attack damage", () => {
  const state = createInitialState(GAME_CONFIG);
  state.selectedDragonId = "tide";

  assert.equal(modifiedAttackDamage(GAME_CONFIG, state), 11);
  assert.ok(modifiedAttackDamage(GAME_CONFIG, state) < GAME_CONFIG.baseAttackDamage);
});

test("Balanced keeps near-base values", () => {
  const state = createInitialState(GAME_CONFIG);
  state.selectedDragonId = "moss";

  assert.equal(modifiedAttackDamage(GAME_CONFIG, state), GAME_CONFIG.baseAttackDamage);
  assert.equal(modifiedDefenceDuration(GAME_CONFIG, state), GAME_CONFIG.baseDefenceTime);
  assert.ok(modifiedSkillCooldown(GAME_CONFIG, state) < GAME_CONFIG.ultimateCd);
  assert.ok(modifiedSkillCooldown(GAME_CONFIG, state) > GAME_CONFIG.ultimateCd * 0.9);
});

test("enemy and player dragon facing render data are opposite", () => {
  const state = createInitialState(GAME_CONFIG);
  const renderData = getBattleRenderData(GAME_CONFIG, state);

  assert.notEqual(renderData.player.flip, renderData.enemy.flip);
  assert.notEqual(renderData.player.direction, renderData.enemy.direction);
});
