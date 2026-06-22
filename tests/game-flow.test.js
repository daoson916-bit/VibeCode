const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function loadGame() {
  const html = fs.readFileSync("index.html", "utf8");
  const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
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
  const window = { addEventListener() {} };
  class ImageStub {
    set src(value) { this.currentSrc = value; }
  }
  const context = {
    clearInterval() {},
    clearTimeout() {},
    console,
    document: { getElementById: () => canvas },
    Image: ImageStub,
    Math,
    performance: { now: () => 0 },
    requestAnimationFrame() {},
    setInterval: () => 1,
    setTimeout: () => 1,
    window
  };
  vm.runInNewContext(source, context);
  return window.DragonFighter;
}

function startBattle(app, dragonId = "ember") {
  app.playNow();
  app.state.selectedDragonId = dragonId;
  app.confirmDragon();
}

test("game starts at Main Menu and Play Now opens Dragon Select", () => {
  const app = loadGame();
  assert.equal(app.state.phase, app.CONFIG.flow.initialPhase);
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
