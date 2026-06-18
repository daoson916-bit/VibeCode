import { attemptCommand } from '../combat/actions.js';
import { mapKeyboardCommand } from './inputMapper.js';

export function registerKeyboardInput({ config, state, logger }) {
  window.addEventListener(config.input.keyboardCommandEvent, (event) => {
    if (!config.input.enableKeyboardInput) {
      return;
    }

    const command = mapKeyboardCommand(config, event.key);
    Object.assign(state, attemptCommand(state, config, 'player1', command));
    logger.log('inputEvents', 'keyboard command attempted', state.lastCommandResult);
  });
}
