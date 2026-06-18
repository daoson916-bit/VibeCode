const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const entries = [
  "index.html",
  "src/gameCore.js",
  "dragon-fighter-prototype/dragon-fighter/public/assets/backgrounds/arena.png",
  "dragon-fighter-prototype/dragon-fighter/public/assets/dragons/fire-dragon-adult.png",
  "dragon-fighter-prototype/dragon-fighter/public/assets/dragons/holy-paladin-dragon-adult.png",
  "dragon-fighter-prototype/dragon-fighter/public/assets/dragons/moss-boss-dragon-adult.png",
  "dragon-fighter-prototype/dragon-fighter/public/assets/dragons/moss-boss-dragon-enemy.png"
];

fs.rmSync(dist, { recursive: true, force: true });

entries.forEach((entry) => {
  const from = path.join(root, entry);
  const to = path.join(dist, entry);

  if (!fs.existsSync(from)) {
    throw new Error(`Missing build input: ${entry}`);
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
});

console.log(`Built static game to ${path.relative(root, dist)}`);
