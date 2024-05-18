var currentVersion = 0.3;
const main = document.getElementById("mainInfo");
var gameSpeed = 1;
var player = {
  isDead: false,
  spawnDelay: Math.floor((options.spawnDelay * 100) / 3),
  spawnTimer: Math.floor((options.spawnDelay * 100) / 3),
  levelCoord: [0, 0],
  get currentLevel() {
    return worldMap[player.levelCoord[0]][player.levelCoord[1]];
  },
  x: 0,
  y: 0,
  xv: 0,
  yv: 0,
  g: 325,
  canWalljump: false,
  canJump: true,
  currentJumps: 0,
  maxJumps: 1,
  moveSpeed: 600,
  triggers: [],
  godMode: false,
  reachedHub: false,
  deaths: 0,
  timePlayed: 0,
  branchTime: 0,
  finalDeaths: 0,
  finalTimePlayed: 0,
  gameComplete: false
};

function openInfo() {
    if (main.style.bottom == "0%") {
        main.style.bottom = "100%";
        main.style.opacity = 0;
    } else {
        main.style.bottom = "0%";
        main.style.opacity = 1;
    }
  }