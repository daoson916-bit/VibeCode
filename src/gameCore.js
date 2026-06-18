const GAME_CONFIG = {
  matchTime: 60,
  maxHp: 100,
  baseAttackDamage: 12,
  ultimateDamage: 35,
  enemyDamage: 10,
  attackCd: 1.0,
  defenceCd: 5.0,
  ultimateCd: 9.0,
  baseDefenceTime: 3.0,
  defenceReduce: 0.35,
  enemyMinWait: 1.3,
  enemyMaxWait: 2.4,
  assets: {
    background: "dragon-fighter-prototype/dragon-fighter/public/assets/backgrounds/arena.png",
    enemy: "dragon-fighter-prototype/dragon-fighter/public/assets/dragons/moss-boss-dragon-enemy.png"
  },
  facing: {
    player: { flip: false, direction: "right" },
    enemy: { flip: true, direction: "left" }
  },
  dragons: [
    {
      id: "ember",
      name: "Ember",
      role: "Attack Focus",
      flavor: "A close-range striker that burns battles down fast.",
      asset: "dragon-fighter-prototype/dragon-fighter/public/assets/dragons/fire-dragon-adult.png",
      modifiers: {
        attackDamage: 1.2,
        defenceDuration: 0.85,
        skillCooldown: 1
      }
    },
    {
      id: "tide",
      name: "Tide",
      role: "Defence Focus",
      flavor: "A patient guardian that turns pressure into survival.",
      asset: "dragon-fighter-prototype/dragon-fighter/public/assets/dragons/holy-paladin-dragon-adult.png",
      modifiers: {
        attackDamage: 0.9,
        defenceDuration: 1.25,
        skillCooldown: 1
      }
    },
    {
      id: "moss",
      name: "Moss",
      role: "Balanced",
      flavor: "A steady duelist with reliable rhythm and tempo.",
      asset: "dragon-fighter-prototype/dragon-fighter/public/assets/dragons/moss-boss-dragon-adult.png",
      modifiers: {
        attackDamage: 1,
        defenceDuration: 1,
        skillCooldown: 0.95
      }
    }
  ],
  dragonSelect: {
    titleY: 70,
    subtitleY: 108,
    cardY: 145,
    cardW: 310,
    cardH: 330,
    cardGap: 30,
    firstCardX: 70,
    imageY: 252,
    imageW: 195,
    imageH: 140,
    confirm: { x: 415, y: 510, w: 270, h: 48 }
  },
  battleLayout: {
    playerX: 320,
    enemyX: 780,
    dragonY: 330,
    dragonW: 255,
    dragonH: 185
  }
};

function getDragonById(config, dragonId) {
  return config.dragons.find((dragon) => dragon.id === dragonId) || config.dragons[0];
}

function getSelectedDragon(config, state) {
  return getDragonById(config, state.selectedDragonId);
}

function createInitialState(config = GAME_CONFIG) {
  return {
    phase: "select",
    selectedDragonId: config.dragons[0].id,
    time: config.matchTime,
    playerHp: config.maxHp,
    enemyHp: config.maxHp,
    lastHeard: "-",
    accepted: "-",
    playerState: "Choose",
    enemyState: "Ready",
    message: "Choose your dragon.",
    note: "Select a dragon, then confirm to battle.",
    result: "",
    cd: { attack: 0, defence: 0, ultimate: 0 },
    defenceTimer: 0,
    enemyTimer: 1.6,
    shake: 0,
    particles: []
  };
}

function modifiedAttackDamage(config, state) {
  const dragon = getSelectedDragon(config, state);
  return Math.round(config.baseAttackDamage * dragon.modifiers.attackDamage);
}

function modifiedDefenceDuration(config, state) {
  const dragon = getSelectedDragon(config, state);
  return config.baseDefenceTime * dragon.modifiers.defenceDuration;
}

function modifiedSkillCooldown(config, state) {
  const dragon = getSelectedDragon(config, state);
  return config.ultimateCd * dragon.modifiers.skillCooldown;
}

function getCommandCooldown(config, state, command) {
  if (command === "attack") return config.attackCd;
  if (command === "defence") return config.defenceCd;
  if (command === "ultimate") return modifiedSkillCooldown(config, state);
  return 0;
}

function getBattleRenderData(config, state) {
  const selected = getSelectedDragon(config, state);
  return {
    player: {
      assetKey: selected.id,
      name: selected.name,
      role: selected.role,
      flip: config.facing.player.flip,
      direction: config.facing.player.direction
    },
    enemy: {
      assetKey: "enemy",
      name: "Enemy Dragon",
      role: "Rival",
      flip: config.facing.enemy.flip,
      direction: config.facing.enemy.direction
    }
  };
}

const GameCore = {
  GAME_CONFIG,
  getDragonById,
  getSelectedDragon,
  createInitialState,
  modifiedAttackDamage,
  modifiedDefenceDuration,
  modifiedSkillCooldown,
  getCommandCooldown,
  getBattleRenderData
};

if (typeof module !== "undefined") {
  module.exports = GameCore;
}

if (typeof window !== "undefined") {
  window.GameCore = GameCore;
}
