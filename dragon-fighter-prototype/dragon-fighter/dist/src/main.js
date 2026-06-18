import { CONFIG } from './config.js';
import { createInitialGameState } from './core/gameState.js';
import { startGameLoop } from './core/gameLoop.js';
import { createLogger } from './core/logger.js';
import { createAssetStore } from './assets/assetLoader.js';
import { registerKeyboardInput } from './input/keyboardInput.js';
import { registerPointerInput } from './input/pointerInput.js';
import { createCanvasRenderer } from './render/canvasRenderer.js';

document.title = CONFIG.labels.title;
document.body.style.background = CONFIG.canvas.pageBackground;

const canvas = document.getElementById(CONFIG.canvas.elementId);
const logger = createLogger(CONFIG);
const assetStore = createAssetStore(CONFIG, logger);
const state = createInitialGameState(CONFIG);
const renderer = createCanvasRenderer(CONFIG, assetStore);

logger.log('appEvents', 'app started');
logger.log('stateEvents', 'initial state created', state);
assetStore.loadImages();

registerPointerInput({
  canvas,
  config: CONFIG,
  layoutData: renderer.layoutData,
  state,
  logger
});

registerKeyboardInput({
  config: CONFIG,
  state,
  logger
});

startGameLoop({
  config: CONFIG,
  canvas,
  renderer,
  state,
  logger
});
