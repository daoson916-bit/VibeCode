import { confirmDragonSelection, selectDragon } from '../core/gameState.js';
import { attemptCommand } from '../combat/actions.js';
import { mapCanvasCommand } from './inputMapper.js';

export function registerPointerInput({ canvas, config, layoutData, state, logger }) {
  canvas.addEventListener(config.input.pointerSelectEvent, (event) => {
    const point = toCanvasPoint(canvas, config, event);

    if (state.phase !== config.match.initialPhase) {
      handleCombatButton(point, config, layoutData, state, logger);
      return;
    }

    const optionRect = layoutData.dragonSelect.optionRects.find((rect) => containsPoint(rect, point));

    if (optionRect) {
      Object.assign(state, selectDragon(state, config, optionRect.id));
      logger.log('inputEvents', 'dragon selected', { dragonId: optionRect.id });
      return;
    }

    if (containsPoint(layoutData.dragonSelect.confirmButtonRect, point)) {
      Object.assign(state, confirmDragonSelection(state, config));
      logger.log('inputEvents', 'dragon select confirm', { phase: state.phase });
    }
  });
}

function handleCombatButton(point, config, layoutData, state, logger) {
  if (!config.input.enablePointerButtons) {
    return;
  }

  const buttonRect = layoutData.combatButtonRects.find((rect) => containsPoint(rect, point));

  if (!buttonRect) {
    return;
  }

  const command = mapCanvasCommand(config, buttonRect.command);
  Object.assign(state, attemptCommand(state, config, 'player1', command));
  logger.log('inputEvents', 'canvas command attempted', state.lastCommandResult);
}

function toCanvasPoint(canvas, config, event) {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - bounds.left) * (config.canvas.width / bounds.width),
    y: (event.clientY - bounds.top) * (config.canvas.height / bounds.height)
  };
}

function containsPoint(rect, point) {
  return point.x >= rect.x
    && point.x <= rect.x + rect.width
    && point.y >= rect.y
    && point.y <= rect.y + rect.height;
}
