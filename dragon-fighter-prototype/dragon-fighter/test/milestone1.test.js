import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CONFIG } from '../src/config.js';
import { createImageRecords, getLoadedAssetImage, getLoadedDragonImage } from '../src/assets/assetLoader.js';
import { confirmDragonSelection, createInitialGameState, selectDragon } from '../src/core/gameState.js';
import { createLayout } from '../src/ui/layout.js';

test('config exposes the required Milestone 1 command words', () => {
  assert.deepEqual(CONFIG.input.validCommands, ['Attack', 'Defence', 'Block', 'Skill']);
});

test('config exposes exactly three selectable dragons', () => {
  assert.equal(CONFIG.dragons.options.length, 3);
  assert.deepEqual(
    CONFIG.dragons.options.map((dragon) => dragon.name),
    ['Ember', 'Tide', 'Volt']
  );
});

test('asset manifest contains the three selected dragon entries', () => {
  const optionAssetKeys = CONFIG.dragons.options.map((dragon) => dragon.imageAssetKey);

  assert.equal(new Set(optionAssetKeys).size, 3);
  optionAssetKeys.forEach((assetKey) => {
    assert.ok(CONFIG.assets.dragonImages[assetKey]);
    assert.equal(CONFIG.assets.dragonImages[assetKey].licenseWarning, CONFIG.assets.privatePrototypeWarning);
    assert.ok(existsSync(CONFIG.assets.dragonImages[assetKey].path));
  });
});

test('each Dragon Select option references a valid asset key', () => {
  CONFIG.dragons.options.forEach((dragon) => {
    const asset = CONFIG.assets.dragonImages[dragon.imageAssetKey];

    assert.ok(asset);
    assert.equal(asset.key, dragon.imageAssetKey);
  });
});

test('arena background asset manifest points at the local background image', () => {
  const assetKey = CONFIG.assets.arenaBackground.assetKey;
  const asset = CONFIG.assets.backgroundImages[assetKey];

  assert.ok(asset);
  assert.equal(asset.path, 'public/assets/backgrounds/arena.png');
  assert.ok(existsSync(asset.path));
});

test('initial state starts at Dragon Select', () => {
  const state = createInitialGameState(CONFIG);

  assert.equal(state.phase, CONFIG.match.initialPhase);
  assert.equal(state.phase, 'dragon-select');
  assert.equal(state.dragonSelect.selectedDragonId, null);
});

test('selecting a dragon updates selected dragon state', () => {
  const state = selectDragon(createInitialGameState(CONFIG), CONFIG, 'tide');

  assert.equal(state.dragonSelect.selectedDragonId, 'tide');
  assert.equal(state.dragonSelect.feedback, 'Tide');
});

test('confirm without selection does not transition', () => {
  const state = confirmDragonSelection(createInitialGameState(CONFIG), CONFIG);

  assert.equal(state.phase, CONFIG.match.initialPhase);
  assert.equal(state.dragonSelect.feedback, CONFIG.labels.dragonSelectBlockedFeedback);
});

test('confirm with selection transitions to countdown before arena combat', () => {
  const selectedState = selectDragon(createInitialGameState(CONFIG), CONFIG, 'volt');
  const state = confirmDragonSelection(selectedState, CONFIG);

  assert.equal(state.phase, CONFIG.match.countdownPhase);
});

test('selected dragon is used as Player 1 dragon data', () => {
  const selectedState = selectDragon(createInitialGameState(CONFIG), CONFIG, 'ember');
  const state = confirmDragonSelection(selectedState, CONFIG);

  assert.equal(state.players.player1.dragon.name, 'Ember');
  assert.equal(state.players.player1.dragon.roleLabel, 'Attack Focus');
  assert.equal(state.players.player1.dragon.imageAssetKey, 'fireDragonAdult');
  assert.equal(state.players.player1.dragon.futureModifiers.attackMultiplier, 1.15);
});

test('selected dragon asset key is used in arena rendering state', () => {
  const selectedState = selectDragon(createInitialGameState(CONFIG), CONFIG, 'volt');
  const state = confirmDragonSelection(selectedState, CONFIG);
  const selectedConfigDragon = CONFIG.dragons.options.find((dragon) => dragon.id === 'volt');

  assert.equal(state.players.player1.dragon.imageAssetKey, selectedConfigDragon.imageAssetKey);
  assert.equal(CONFIG.assets.dragonImages[state.players.player1.dragon.imageAssetKey].key, 'mossBossDragonAdult');
});

test('renderer image helper falls back when image is missing or failed', () => {
  const imageRecords = createImageRecords(CONFIG);
  const assetKey = CONFIG.dragons.options[0].imageAssetKey;

  assert.equal(getLoadedDragonImage({ imageRecords }, CONFIG, assetKey), null);

  imageRecords[assetKey].status = CONFIG.assets.imageStatusError;
  assert.equal(getLoadedDragonImage({ imageRecords }, CONFIG, assetKey), null);
});

test('arena background helper falls back when image is missing or failed', () => {
  const imageRecords = createImageRecords(CONFIG);
  const assetKey = CONFIG.assets.arenaBackground.assetKey;

  assert.equal(getLoadedAssetImage({ imageRecords }, CONFIG, assetKey), null);

  imageRecords[assetKey].status = CONFIG.assets.imageStatusError;
  assert.equal(getLoadedAssetImage({ imageRecords }, CONFIG, assetKey), null);
});

test('initial arena state labels are Idle', () => {
  const selectedState = selectDragon(createInitialGameState(CONFIG), CONFIG, 'tide');
  const state = confirmDragonSelection(selectedState, CONFIG);

  assert.equal(state.players.player1.stateLabel, CONFIG.labels.idleState);
  assert.equal(state.players.player2.stateLabel, CONFIG.labels.idleState);
});

test('layout places HUD in required screen regions', () => {
  const layout = createLayout(CONFIG);

  assert.equal(layout.player1PanelRect.x, CONFIG.layout.safeAreaPadding);
  assert.equal(layout.player1PanelRect.y, CONFIG.layout.safeAreaPadding);
  assert.equal(layout.player2PanelRect.x, CONFIG.canvas.width - CONFIG.layout.safeAreaPadding - CONFIG.layout.statusPanelWidth);
  assert.equal(layout.player2PanelRect.y, CONFIG.layout.safeAreaPadding);
  assert.equal(layout.timerRect.x, CONFIG.canvas.width * CONFIG.math.half - CONFIG.layout.timerPanelWidth * CONFIG.math.half);
  assert.equal(layout.commandReferenceRect.x, CONFIG.canvas.width * CONFIG.math.half - CONFIG.layout.commandReferenceWidth * CONFIG.math.half);
});

test('layout creates three Dragon Select option rects and a confirm button', () => {
  const layout = createLayout(CONFIG);

  assert.equal(layout.dragonSelect.optionRects.length, CONFIG.dragons.options.length);
  assert.equal(layout.dragonSelect.optionRects[CONFIG.math.zero].id, 'ember');
  assert.equal(layout.dragonSelect.confirmButtonRect.width, CONFIG.layout.dragonSelectConfirmWidth);
});

test('layout creates a behind-right Player 1 arena composition', () => {
  const layout = createLayout(CONFIG);

  assert.ok(layout.player1Position.x > layout.player2Position.x);
  assert.ok(layout.player1Position.y > layout.player2Position.y);
  assert.ok(layout.player1DragonPosition.y > layout.player2DragonPosition.y);
  assert.ok(layout.player1DragonPosition.x > layout.player2Position.x);
});
