export function normalizeCommand(config, rawCommand) {
  const commandText = String(rawCommand ?? '').trim().toLowerCase();
  const command = config.input.validCommands.find((validCommand) => (
    validCommand.toLowerCase() === commandText
  ));

  return command ?? null;
}

export function mapKeyboardCommand(config, keyboardKey) {
  const mappedCommand = config.input.keyboardBindings[String(keyboardKey ?? '').toLowerCase()];
  return normalizeCommand(config, mappedCommand);
}

export function mapCanvasCommand(config, rawCommand) {
  return normalizeCommand(config, rawCommand);
}
