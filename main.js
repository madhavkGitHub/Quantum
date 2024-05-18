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

const control = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    madeFirstInput: false
  };

// Key Down

document.addEventListener("keydown", function (input) {

    let key = input.code;
    switch (key) {
      case "ArrowUp":
      case "KeyW":
        control.up = true;
        control.madeFirstInput = true;
        break;
      case "ArrowDown":
      case "KeyS":
        control.down = true;
        control.madeFirstInput = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        control.left = true;
        control.madeFirstInput = true;
        break;
      case "ArrowRight":
      case "KeyD":
        control.right = true;
        control.madeFirstInput = true;
        break;
      case "Space":
        control.space = true;
        control.madeFirstInput = true;
        break;
      case "Delete":
        wipeSave();
        break;
      case "KeyR":
        if (input.shiftKey) {
          if (player.reachedHub) {
            if (confirm("Are you sure you want to go to the hub?")) {
              player.spawnPoint = [
                7,
                5,
                5,
                4,
                325,
                1,
                600,
                [...player.triggers],
                currentVersion,
                true,
                player.timePlayed,
                player.deaths,
                player.gameComplete,
                player.finalTimePlayed,
                player.finalDeaths,
                0
              ];
              respawn();
            }
          } else alert("You have not reached the hub yet.");
        } else {
          player.isDead = true;
          player.spawnTimer = 0;
        }
        break;
      case "KeyC":
        openInfo();
        break;
      case "Backslash":
        if (input.shiftKey) {
          importSave();
        } else exportSave();
        break;
      default:
        break;
    }
  });

//Key Up 

document.addEventListener("keyup", function (input) {
    let key = input.code;
    switch (key) {
      case "ArrowUp":
      case "KeyW":
        control.up = false;
        if (!control.down && !control.space) player.canJump = true;
        break;
      case "ArrowDown":
      case "KeyS":
        control.down = false;
        if (!control.up && !control.space) player.canJump = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        control.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        control.right = false;
        break;
      case "Space":
        control.space = false;
        if (!control.up && !control.down) player.canJump = true;
        break;
      default:
        break;
    }
  });
  

  function getBlockType(x, y) {
    let level = levels[player.currentLevel];
    if (x < 0 || x >= level.length || y < 0 || y >= level[0].length) {
      if (level[x - 1] != undefined) {
        if (typeof level[x - 1][y] == "object") {
          if (level[x - 1][y][0] == -1) {
            return [
              -2,
              level[x - 1][y][1],
              level[x - 1][y][2],
              level[x - 1][y][3]
            ];
          }
        }
      }

      if (level[x + 1] != undefined) {
        if (typeof level[x + 1][y] == "object") {
          if (level[x + 1][y][0] == -1) {
            return [
              -2,
              level[x + 1][y][1],
              level[x + 1][y][2],
              level[x + 1][y][3]
            ];
          }
        }
      }
      if (level[x] != undefined) {
        if (typeof level[x][y - 1] == "object") {
          if (level[x][y - 1][0] == -1) {
            return [
              -2,
              level[x][y - 1][1],
              level[x][y - 1][2],
              level[x][y - 1][3]
            ];
          }
        }
        if (typeof level[x][y + 1] == "object") {
          if (level[x][y + 1][0] == -1) {
            return [
              -2,
              level[x][y + 1][1],
              level[x][y + 1][2],
              level[x][y + 1][3]
            ];
          }
        }
      }
      return 1;
    }
    return level[x][y];
  }

function openInfo() {
    if (main.style.bottom == "0%") {
        main.style.bottom = "100%";
        main.style.opacity = 0;
    } else {
        main.style.bottom = "0%";
        main.style.opacity = 1;
    }
  }
