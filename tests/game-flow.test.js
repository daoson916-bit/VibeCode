const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function loadGame() {
  const html = fs.readFileSync("index.html", "utf8");
  const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const intervals = [];
  const keyHandlers = [];
  const context2d = new Proxy({}, {
    get(target, property) {
      if (property === "createLinearGradient") return () => ({ addColorStop() {} });
      if (property === "measureText") return (value) => ({ width: String(value).length * 8 });
      if (!(property in target)) target[property] = () => {};
      return target[property];
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    }
  });
  const canvas = {
    addEventListener() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1400, height: 620 }),
    getContext: () => context2d,
    style: {}
  };
  const window = {
    addEventListener(type, handler) {
      if (type === "keydown") keyHandlers.push(handler);
    }
  };
  class ImageStub {
    set src(value) { this.currentSrc = value; }
  }
  class SpeechRecognitionStub {
    start() {
      this.started = true;
      if (this.onstart) this.onstart();
    }
    stop() {
      this.started = false;
      if (this.onend) this.onend();
    }
  }
  const context = {
    clearInterval() {},
    clearTimeout() {},
    console,
    document: { getElementById: () => canvas },
    Image: ImageStub,
    Math,
    performance: { now: () => context.now },
    requestAnimationFrame() {},
    setInterval: (handler, ms) => {
      intervals.push({ handler, ms });
      return intervals.length;
    },
    setTimeout: () => 1,
    window,
    now: 0
  };
  window.SpeechRecognition = SpeechRecognitionStub;
  vm.runInNewContext(source, context);
  window.DragonFighter.__test = { context, intervals, keyHandlers };
  return window.DragonFighter;
}

function startBattle(app, dragonId = "ember") {
  app.completeTutorial();
  app.playNow();
  app.state.selectedDragonId = dragonId;
  app.confirmDragon();
}

test("tutorial flow works before Main Menu and Play Now opens Dragon Select", () => {
  const app = loadGame();
  assert.equal(app.state.phase, app.CONFIG.flow.initialPhase);
  assert.equal(app.state.phase, "tutorial");
  assert.equal(app.state.tutorialStep, 0);
  app.nextTutorialStep();
  assert.equal(app.state.tutorialStep, 1);
  app.completeTutorial();
  assert.equal(app.state.phase, "menu");
  assert.equal(app.CONFIG.flow.labels.playNow, "Play Now");

  app.playNow();
  assert.equal(app.state.phase, "select");
});

test("loss exposes only Retry Match and Back to Main Menu", () => {
  const app = loadGame();
  startBattle(app);
  app.finish("YOU LOSE");

  const actions = Array.from(app.core.getResultActions(app.CONFIG, app.state), (action) => [action.id, action.label]);
  assert.deepEqual(actions, [
    ["retryMatch", "Retry Match"],
    ["backToMainMenu", "Back to Main Menu"]
  ]);
});

test("win exposes only Continue and enters existing upgrade flow", () => {
  const app = loadGame();
  startBattle(app);
  app.finish("YOU WIN");

  const actions = Array.from(app.core.getResultActions(app.CONFIG, app.state), (action) => action.id);
  assert.deepEqual(actions, ["continueAfterWin"]);
  app.continueAfterWin();
  assert.equal(app.state.phase, "upgrade");
  assert.equal(app.state.stage, 1);
});

test("Retry Match restores the same dragon, stage, and upgrades", () => {
  const app = loadGame();
  startBattle(app, "tide");
  app.state.stage = 3;
  app.state.upgrades.power = 2;
  app.state.upgrades.guard = 1;
  app.finish("YOU LOSE BY HP");

  app.state.selectedDragonId = "moss";
  app.state.stage = 9;
  app.state.upgrades.power = 7;
  app.retryLastBattle();

  assert.equal(app.state.phase, "playing");
  assert.equal(app.state.selectedDragonId, "tide");
  assert.equal(app.state.stage, 3);
  assert.equal(app.state.upgrades.power, 2);
  assert.equal(app.state.upgrades.guard, 1);
  assert.equal(app.state.battleOutcome, null);
});

test("Back to Main Menu clears temporary run, buffs, and match state", () => {
  const app = loadGame();
  startBattle(app, "moss");
  app.state.stage = 4;
  app.state.victories = 3;
  app.state.upgrades.focus = 2;
  app.state.pendingAttacks.push({ command: "attack" });
  app.finish("YOU LOSE");
  app.backToMainMenu();

  assert.equal(app.state.phase, "menu");
  assert.equal(app.state.selectedDragonId, null);
  assert.equal(app.state.stage, 1);
  assert.equal(app.state.victories, 0);
  assert.equal(app.state.upgrades.focus, 0);
  assert.equal(app.state.battleOutcome, null);
  assert.equal(app.state.result, "");
  assert.equal(app.state.pendingAttacks.length, 0);
});

test("Ultimate starts on its normal full cooldown for new and retried battles", () => {
  const app = loadGame();
  startBattle(app, "moss");
  const initialCooldown = app.core.getCommandCooldown(app.CONFIG, app.state, "ultimate");
  assert.equal(app.CONFIG.combatStart.ultimateOnFullCooldown, true);
  assert.equal(app.state.cd.ultimate, initialCooldown);
  assert.ok(app.state.cd.ultimate > 0);

  app.finish("YOU LOSE");
  app.retryLastBattle();
  assert.equal(app.state.cd.ultimate, app.core.getCommandCooldown(app.CONFIG, app.state, "ultimate"));
});

test("voice recognition is English and uses the configured 0.5s interval", () => {
  const app = loadGame();
  const recognition = app.getRecognition();

  assert.equal(app.CONFIG.voice.language, "en-US");
  assert.equal(recognition.lang, "en-US");
  app.completeTutorial();
  app.playNow();
  app.state.selectedDragonId = "ember";
  app.confirmDragon();
  app.toggleMic();

  assert.equal(app.CONFIG.voice.scanIntervalSeconds, 0.5);
  assert.ok(app.__test.intervals.some((interval) => interval.ms === app.CONFIG.voice.scanIntervalMs));
  assert.equal(app.CONFIG.voice.scanIntervalMs, 500);
});

test("valid full-word voice casts immediately when ready and cooldown blocks casting", () => {
  const app = loadGame();
  startBattle(app);
  app.toggleMic();
  app.state.cd.attack = 0;

  const cast = app.processRecognizedCommand(app.commandFromSpeech("attack"), "attack:1", 1000);
  assert.equal(cast, true);
  assert.equal(app.state.accepted, "ATTACK");
  assert.ok(app.state.cd.attack > 0);
  const pendingAfterCast = app.state.pendingAttacks.length;

  const cooldownCast = app.processRecognizedCommand(app.commandFromSpeech("attack"), "attack:2", 2000);
  assert.equal(cooldownCast, false);
  assert.equal(app.state.pendingAttacks.length, pendingAfterCast);
  assert.match(app.state.message, /cooldown/i);
  assert.equal(app.commandFromSpeech("attack block"), null);
});

test("duplicate voice result does not cast twice", () => {
  const app = loadGame();
  startBattle(app);
  app.toggleMic();
  app.state.cd.attack = 0;

  assert.equal(app.processRecognizedCommand("attack", "attack:dup", 1000), true);
  const pendingAfterCast = app.state.pendingAttacks.length;
  app.state.cd.attack = 0;
  assert.equal(app.processRecognizedCommand("attack", "attack:dup", 1200), false);
  assert.equal(app.state.pendingAttacks.length, pendingAfterCast);
});

test("manual command buttons and combat keys are disabled while mic is active", () => {
  const app = loadGame();
  startBattle(app);
  app.toggleMic();
  app.draw();

  assert.equal(app.manualCombatInputDisabled(), true);
  const attackButton = app.getButtons().find((button) => button.id === "attack");
  assert.equal(attackButton.disabled, true);
  app.useCommand("attack", "canvas");
  assert.equal(app.state.accepted, "-");

  app.__test.keyHandlers[0]({ key: "a" });
  assert.equal(app.state.accepted, "-");

  app.state.cd.attack = 0;
  assert.equal(app.processRecognizedCommand("attack", "attack:voice", 1000), true);
  assert.equal(app.state.accepted, "ATTACK");
});

test("buttons and combat keys work again after mic is stopped", () => {
  const app = loadGame();
  startBattle(app);
  app.toggleMic();
  app.toggleMic();
  app.draw();

  assert.equal(app.manualCombatInputDisabled(), false);
  const attackButton = app.getButtons().find((button) => button.id === "attack");
  assert.equal(attackButton.disabled, false);
  app.state.cd.attack = 0;
  app.__test.keyHandlers[0]({ key: "a" });
  assert.equal(app.state.accepted, "ATTACK");
});
