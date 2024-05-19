var currentVersion = 0.3;
const main = document.getElementById("mainInfo");
var gameSpeed = 1;
var Xvar = -2000;
var Yvar = -3000;
var Zvar = -4000;
var last_activation_xgate = 0;
var last_activation_ygate = 0;

var player = {
  spawnPoint: newSave(),
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
  xvmult: 1,
  yvmult: 1,
  latest_xvmult: 1,
  latest_yvmult: 1,
  g: 325,
  solid: true,
  latest_solidity: true,
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

const hasHitbox = [1, 5, 11, 40];
const diff = ""
const prefix = diff === "" ? "" : "../";

// Key Down
var fadein = null;
var fadeout = null;
var toFadein = null;

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
  
var lastFrame = 0;
var simReruns = 20;
var sinceLastSave = 0;
var noFriction = false;
var branchInProgress = true;
function nextFrame(timeStamp) {
  // setup stuff
  let dt = timeStamp - lastFrame;
  if (dt === 0) {
    window.requestAnimationFrame(nextFrame);
    return;
  }
  if (control.madeFirstInput) {
    player.timePlayed += dt;
    if (branchInProgress) player.branchTime += dt;
  }
  player.spawnPoint[10] = player.timePlayed;
  player.spawnPoint[15] = player.branchTime;
  id("timePlayed").innerHTML = formatTime(player.timePlayed);
  id("branchTime").innerHTML = formatTime(player.branchTime);
  id("timer").innerHTML =
    formatTime(player.timePlayed, false) +
    "<br>" +
    formatTime(player.branchTime, false);
  sinceLastSave += dt;
  if (sinceLastSave >= 5000) {
    save();
    sinceLastSave -= 5000;
  }
  if (fadein) {
    fadein.volume = Math.min(
      fadein.volume + (dt / 5000) * options.volume,
      options.volume
    );
    if (fadein.volume === options.volume) fadein = null;
  }
  if (fadeout) {
    fadeout.volume = Math.max(fadeout.volume - (dt / 5000) * options.volume, 0);
    if (fadeout.volume === 0) {
      fadeout.pause();
      fadeout.currentTime = 0;
      fadeout = null;
    }
  }
  dt *= gameSpeed;
  lastFrame = timeStamp;
  if (dt < 100 * gameSpeed) {
    dt = dt / simReruns;
    let xprev = player.x;
    let yprev = player.y;
    let lvlxprev = player.levelCoord[0];
    let lvlyprev = player.levelCoord[1];
    let triggersPrev = [...player.triggers];
    let shouldDrawLevel = false;
    for (let i = 0; i < simReruns; i++) {
      // some weird fricker to do stuff
      if (!player.isDead) {
        player.x += (player.xv * dt) / 500;
        player.y +=
          (player.yv * dt) / 500 + ((player.g / 2) * dt * dt) / 500 / 500;
        // velocity change
        if (!noFriction) {
          player.xv *= Math.pow(0.5, dt / 6);
          if (Math.abs(player.xv) < 5) player.xv = 0;
        }
        if (
          (player.yv > player.g && player.g > 0) ||
          (player.yv < player.g && player.g < 0)
        ) {
          player.yv -= (player.g * dt) / 500;
          if (Math.abs(player.yv) < player.g) player.yv = player.g;
        } else {
          player.yv += (player.g * dt) / 500;
        }
      }
      // collision detection
      let level = levels[player.currentLevel];
      let onIce = false;
      let shouldDie = false;
      let bx1 = Math.floor((player.x - 0.001) / blockSize);
      let bx2 = Math.floor((player.x + playerSize) / blockSize);
      let by1 = Math.floor((player.y - 0.001) / blockSize);
      let by2 = Math.floor((player.y + playerSize) / blockSize);
      let wallLeft = false;
      let wallRight = false;
      let wallTop = false;
      let wallBottom = false;
      // solid blocks
      for (let x = bx1; x <= bx2; x++) {
        for (let y = by1; y <= by2; y++) {
          if (
            lvlxprev !== player.levelCoord[0] ||
            lvlyprev !== player.levelCoord[1]
          )
            break;
          let type = getBlockType(x, y);
          let props = type;
          if (typeof type === "object") type = type[0];
          let onLeft = false;
          let onRight = false;
          let onTop = false;
          let onBottom = false;
          if ((hasHitbox.includes(type) || type == 5000 || type == -5000) && ((type == 5000 && player.solid == true) || (type == -5000 && player.solid == false) || (type != 5000 && type != -5000))) {
            let dx1 = Math.abs(
              (player.x - (x + 1) * blockSize) / Math.min(-1, player.xv)
            );
            let dx2 = Math.abs(
              (player.x + playerSize - x * blockSize) / Math.max(1, player.xv)
            );
            let dy1 = Math.abs(
              (player.y - (y + 1) * blockSize) / Math.min(-1, player.yv)
            );
            let dy2 = Math.abs(
              (player.y + playerSize - y * blockSize) / Math.max(1, player.yv)
            );
            // top left corner
            if (x === bx1 && y === by1) {
              if (dx1 < dy1 && !hasHitbox.includes(getBlockType(x + 1, y))) {
                onLeft = true;
              } else if (!hasHitbox.includes(getBlockType(x, y + 1))) {
                onTop = true;
              }
            }
            // bottom left corner
            else if (x === bx1 && y === by2) {
              if (dx1 < dy2 && !hasHitbox.includes(getBlockType(x + 1, y))) {
                onLeft = true;
              } else if (!hasHitbox.includes(getBlockType(x, y - 1))) {
                onBottom = true;
              }
            }
            // top right corner
            else if (x === bx2 && y === by1) {
              if (dx2 < dy1 && !hasHitbox.includes(getBlockType(x - 1, y))) {
                onRight = true;
              } else if (!hasHitbox.includes(getBlockType(x, y + 1))) {
                onTop = true;
              }
            }
            // bottom right corner
            else if (x === bx2 && y === by2) {
              if (dx2 < dy2 && !hasHitbox.includes(getBlockType(x - 1, y))) {
                onRight = true;
              } else if (!hasHitbox.includes(getBlockType(x, y - 1))) {
                onBottom = true;
              }
            }
            // bottom right corner
            else if (x === bx2 && y === by2) {
              if (
                Math.abs(
                  (x * blockSize - (player.x + playerSize)) /
                    Math.max(1, Math.abs(player.xv))
                ) <
                  Math.abs(
                    (y * blockSize - (player.y + playerSize)) /
                      Math.max(1, Math.abs(player.yv))
                  ) &&
                !hasHitbox.includes(getBlockType(x - 1, y))
              ) {
                onRight = true;
              } else if (!hasHitbox.includes(getBlockType(x, y - 1))) {
                onBottom = true;
              }
            }
            // left bound
            else if (x === bx1) wallLeft = true;
            // right bound
            else if (x === bx2) wallRight = true;
            // top bound
            else if (y === by1) wallTop = true;
            // bottom bound
            else if (y === by2) wallBottom = true;
            // inside
            else shouldDie = true;
            // velocity check
            if (player.xv < 0) {
              onRight = false;
            } else if (player.xv > 0) onLeft = false;
            if (player.yv < 0) {
              onBottom = false;
            } else if (player.yv > 0) onTop = false;
            // touching side special event
            
            if (onLeft) {
              wallLeft = true;
              switch (type) {
                case 11:
                  if (!player.xg) {
                    
                    player.wallJumpDir = "right";
                    if (player.yv > player.g / 10 && player.g > 0)
                      player.yv = player.g / 10;
                    if (player.yv < player.g / 10 && player.g < 0)
                      player.yv = player.g / 10;
                  }
                  break;
                default:
                  break;
              }
            }
            if (onRight) {
              wallRight = true;
              switch (type) {
                case 11:
                  if (!player.xg) {
                    
                    player.wallJumpDir = "left";
                    if (player.yv > player.g / 10 && player.g > 0)
                      player.yv = player.g / 10;
                    if (player.yv < player.g / 10 && player.g < 0)
                      player.yv = player.g / 10;
                  }
                  break;
                default:
                  break;
              }
            }
            if (onTop) {
              wallTop = true;
              switch (type) {
                case 5:
                  for (let j = bx1; j <= bx2; j++) {
                    let jtype = getBlockType(j, y);
                    if (
                      hasHitbox.includes(jtype) &&
                      jtype !== 5 &&
                      !hasHitbox.includes(getBlockType(j, y + 1))
                    )
                      break;
                    if (j === bx2 && player.g < 0)
                      player.yv = Math.max(275, player.yv);
                  }
                  break;
                case 40:
                  for (let j = bx1; j <= bx2; j++) {
                    let jtype = getBlockType(j, y);
                    if (
                      hasHitbox.includes(jtype) &&
                      jtype !== 40 &&
                      !hasHitbox.includes(getBlockType(j, y + 1))
                    )
                      break;
                    if (j === bx2) onIce = true;
                  }
                  break;
                default:
                  break;
              }
            }
            if (onBottom) {
              wallBottom = true;
              switch (type) {
                case 5:
                  for (let j = bx1; j <= bx2; j++) {
                    let jtype = getBlockType(j, y);
                    if (
                      hasHitbox.includes(jtype) &&
                      jtype !== 5 &&
                      !hasHitbox.includes(getBlockType(j, y - 1))
                    )
                      break;
                    if (j === bx2 && player.g > 0)
                      player.yv = Math.min(-275, player.yv);
                  }
                  break;
                case 40:
                  for (let j = bx1; j <= bx2; j++) {
                    let jtype = getBlockType(j, y);
                    if (
                      hasHitbox.includes(jtype) &&
                      jtype !== 40 &&
                      !hasHitbox.includes(getBlockType(j, y - 1))
                    )
                      break;
                    if (j === bx2) onIce = true;
                  }
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
      if (
        lvlxprev !== player.levelCoord[0] ||
        lvlyprev !== player.levelCoord[1]
      )
        break;
      // ice lol
      if (onIce) {
        noFriction = true;
      } else noFriction = false;
      // collision action
      let onFloor = false;
      if (wallLeft) {
        player.x = (bx1 + 1) * blockSize;
        player.xv = Math.max(0, player.xv);
      }
      if (wallRight) {
        player.x = bx2 * blockSize - playerSize;
        player.xv = Math.min(0, player.xv);
      }
      if (wallTop) {
        player.y = (by1 + 1) * blockSize;
        player.yv = Math.max(0, player.yv);
        if (player.g < 0 && player.yv <= 0) onFloor = true;
      }
      if (wallBottom) {
        player.y = by2 * blockSize - playerSize;
        player.yv = Math.min(0, player.yv);
        if (player.g > 0 && player.yv >= 0) onFloor = true;
      }
      // fully in block
      if (
        hasHitbox.includes(getBlockType(bx1, by1)) &&
        hasHitbox.includes(getBlockType(bx1, by2)) &&
        hasHitbox.includes(getBlockType(bx2, by1)) &&
        hasHitbox.includes(getBlockType(bx2, by2))
      )
        shouldDie = true;
      if (!shouldDie) {
        for (let x = bx1; x <= bx2; x++) {
          for (let y = by1; y <= by2; y++) {
            if (
              lvlxprev !== player.levelCoord[0] ||
              lvlyprev !== player.levelCoord[1]
            )
              break;
            let type = getBlockType(x, y);
            let props = type;
            if (typeof type === "object") type = type[0];
            if (
              player.x < (x + 1) * blockSize - 0.01 &&
              player.x + playerSize > x * blockSize + 0.01 &&
              player.y < (y + 1) * blockSize - 0.01 &&
              player.y + playerSize > y * blockSize + 0.01
            ) {
              switch (type) {
                // Checkpoint
                case -2000:
                  if(timeStamp - last_activation_xgate >= 1000){
                    last_activation_xgate = timeStamp;
                    player.solid = !player.solid;
                    shouldDrawLevel = true;
                  }
                  break;
                case -3000:
                    if(timeStamp - last_activation_ygate >= 1000){
                      last_activation_ygate = timeStamp;
                      player.xvmult = 2.255 - player.xvmult;
                      player.yvmult = 2.03 - player.yvmult;
                      shouldDrawLevel = true;
                    }
                    break;
                case 3:
                  if (!isSpawn(x, y)) {
                    if (player.currentLevel === 8) {
                      branchInProgress = false;
                      player.reachedHub = true;
                    }
                    player.spawnPoint = [
                      x,
                      y,
                      player.levelCoord[0],
                      player.levelCoord[1],
                      player.g,
                      player.maxJumps,
                      player.moveSpeed,
                      [...player.triggers],
                      currentVersion,
                      player.reachedHub,
                      player.timePlayed,
                      player.deaths,
                      player.gameComplete,
                      player.finalTimePlayed,
                      player.finalDeaths,
                      player.branchTime
                    ];
                    player.latest_solidity = player.solid;
                    player.latest_xvmult = player.xvmult;
                    player.latest_yvmult = player.yvmult;
                    shouldDrawLevel = true;
                    save();
                  }
                  break;  
                // death block
                case 2: 
                case -4:
                  shouldDie = true;
                  break;
                // special
                case -2:
                  if (player.currentLevel === 8) {
                    branchInProgress = true;
                    player.branchTime = 0;
                  }
                  let warpId = props[1];
                  if (bx1 < 0) {
                    // left
                    if (props[2] != undefined) {
                      player.levelCoord[0] += props[2];
                      player.levelCoord[1] += props[3];
                    } else player.levelCoord[0]--;
                    player.x =
                      levels[player.currentLevel].length * blockSize -
                      playerSize;
                    player.y =
                      blockSize *
                        levels[player.currentLevel][
                          levels[player.currentLevel].length - 1
                        ].findIndex((x) => x[0] == -1 && x[1] == warpId) +
                      ((player.y + blockSize) % blockSize);
                  } else if (bx2 >= level.length) {
                    // right
                    if (props[2] != undefined) {
                      player.levelCoord[0] += props[2];
                      player.levelCoord[1] += props[3];
                    } else player.levelCoord[0]++;
                    player.x = 0;
                    player.y =
                      blockSize *
                        levels[player.currentLevel][0].findIndex(
                          (x) => x[0] == -1 && x[1] == warpId
                        ) +
                      ((player.y + blockSize) % blockSize);
                  } else if (by1 < 0) {
                    // up
                    if (props[2] != undefined) {
                      player.levelCoord[0] += props[2];
                      player.levelCoord[1] += props[3];
                    } else player.levelCoord[1]++;
                    player.y =
                      levels[player.currentLevel][0].length * blockSize -
                      playerSize;
                    player.x =
                      blockSize *
                        levels[player.currentLevel].findIndex(
                          (x) =>
                            x[x.length - 1][0] == -1 &&
                            x[x.length - 1][1] == warpId
                        ) +
                      ((player.x + blockSize) % blockSize);
                  } else if (by2 >= level[0].length) {
                    // down
                    if (props[2] != undefined) {
                      player.levelCoord[0] += props[2];
                      player.levelCoord[1] += props[3];
                    } else player.levelCoord[1]--;
                    player.y = 0;
                    player.x =
                      blockSize *
                        levels[player.currentLevel].findIndex(
                          (x) => x[0][0] == -1 && x[0][1] == warpId
                        ) +
                      ((player.x + blockSize) % blockSize);
                  }
                default:
                  break;
              }
            }
          }
        }
      }
      if (onFloor) {
        player.currentJumps = player.maxJumps;
      } else if (player.currentJumps === player.maxJumps) player.currentJumps--;
      // die
      if (!player.godMode && shouldDie && !player.isDead) player.isDead = true;
      if (player.isDead) {
        player.spawnTimer -= dt;
        if (player.spawnTimer <= 0) respawn();
      }
      
      // triggers

    }
    dt = dt * simReruns;
    // key input

    if (control.left && player.xv > -player.moveSpeed) {
      player.xv -= (player.moveSpeed * dt) / 50 / (noFriction ? 6 : 1);
      if (player.xv < -player.moveSpeed / (noFriction ? 6 : 1))
        player.xv = -player.moveSpeed / (noFriction ? 6 : 1);
    }
    if (control.right && player.xv < player.moveSpeed) {
      player.xv += (player.moveSpeed * dt) / 50 / (noFriction ? 6 : 1);
      if (player.xv > player.moveSpeed / (noFriction ? 6 : 1))
        player.xv = player.moveSpeed / (noFriction ? 6 : 1);
    }
    if (control.up || control.down || control.space) {
      if (
        player.canJump &&
        (player.currentJumps > 0 || player.godMode)
      ) {
        player.canJump = false;
        player.yv = -Math.sign(player.g) * 205;
        player.currentJumps--;
      }
    }
    player.xv *= player.xvmult;
    player.yv *= player.yvmult;
    // draw checks
    if (player.x != xprev || player.y != yprev) drawPlayer();
    if (
      player.levelCoord[0] !== lvlxprev ||
      player.levelCoord[1] !== lvlyprev ||
      !arraysEqual(player.triggers, triggersPrev) ||
      shouldDrawLevel
    )
      drawLevel();
    if (camx !== lvlx || camy !== lvly)
      adjustScreen(
        player.levelCoord[0] !== lvlxprev || player.levelCoord[1] !== lvlyprev
      );
  }
  window.requestAnimationFrame(nextFrame);
}

function openInfo() {
  if (id("mainInfo").style.bottom == "0%") {
    id("mainInfo").style.bottom = "100%";
    id("mainInfo").style.opacity = 0;
  } else {
    id("mainInfo").style.bottom = "0%";
    id("mainInfo").style.opacity = 1;
  }
}
function newSave() {
  return [
    0,
    2,
    0,
    0,
    325,
    1,
    600,
    [],
    currentVersion,
    false,
    0,
    0,
    false,
    0,
    0,
    0
  ];
}

function save() {
  let saveData = deepCopy(player.spawnPoint);
  if (saveData[5] == Infinity) saveData[5] = "Infinity";
  localStorage.setItem("just-a-save" + diff, JSON.stringify(saveData));
}
function load() {
  if (localStorage.getItem("just-a-save" + diff)) {
    let saveData = JSON.parse(localStorage.getItem("just-a-save" + diff));
    if (saveData[5] == "Infinity") saveData[5] = Infinity;
    if (saveData[8] == undefined) {
      saveData[8] = newSave()[8];
      saveData[3] += 3;
    }
    player.spawnPoint = saveData;
    player.timePlayed = player.spawnPoint[10] ?? 0;
    player.deaths = player.spawnPoint[11] ?? 0;
    player.gameComplete = player.spawnPoint[12] ?? false;
    player.finalTimePlayed = player.spawnPoint[13] ?? 0;
    player.finalDeaths = player.spawnPoint[14] ?? 0;
    player.branchTime = player.spawnPoint[15] ?? 0;
    id("timePlayed").innerHTML = formatTime(player.timePlayed);
    id("deathCount").innerHTML = player.deaths;
    if (player.gameComplete) {
      id("endStat").style.display = "inline";
      id("timePlayedEnd").innerHTML = formatTime(player.finalTimePlayed);
      id("deathCountEnd").innerHTML = player.finalDeaths;
    }
    save();
  }
}
function wipeSave() {
  if (
    !options.wipeConfirm ||
    confirm("Are you sure you want to delete your save?")
  ) {
    player.spawnPoint = newSave();
    save();
    load();
    respawn(false);
    branchInProgress = true;
    drawLevel();
    drawPlayer();
    adjustScreen(true);
    control.madeFirstInput = false;
  }
}
function exportSave() {
  let saveData = btoa(localStorage.getItem("just-a-save" + diff));
  id("exportArea").value = saveData;
  id("exportArea").style.display = "inline";
  id("exportArea").focus();
  id("exportArea").select();
  document.execCommand("copy");
  id("exportArea").style.display = "none";
  alert("Save data copied to clipboard!");
}
function importSave() {
  let saveData = prompt("Please input save data");
  if (saveData) {
    saveData = atob(saveData);
    localStorage.setItem("just-a-save" + diff, saveData);
    load();
    respawn(false);
    drawLevel();
    drawPlayer();
    adjustScreen(true);
  }
}

function isSpawn(x, y) {
  return (
    player.spawnPoint[2] == player.levelCoord[0] &&
    player.spawnPoint[3] == player.levelCoord[1] &&
    player.spawnPoint[0] == x &&
    player.spawnPoint[1] == y
  );
}
function respawn(death = true) {
  if (death) {
    player.deaths++;
    player.spawnPoint[11] = player.deaths;
    player.solid = player.latest_solidity;
    player.xvmult = player.latest_xvmult;
    player.yvmult = player.latest_yvmult;
    id("deathCount").innerHTML = player.deaths;
  }
  player.spawnTimer = player.spawnDelay;
  player.isDead = false;
  player.levelCoord = [player.spawnPoint[2], player.spawnPoint[3]];
  player.xv = 0;
  player.yv = 0;
  player.g = player.spawnPoint[4];
  player.maxJumps = player.spawnPoint[5];
  player.currentJumps = player.maxJumps;
  player.moveSpeed = player.spawnPoint[6];
  player.triggers = [...player.spawnPoint[7]];
  let spawnx = player.spawnPoint[0] * blockSize + (blockSize - playerSize) / 2;
  let spawny = player.spawnPoint[1] * blockSize;
  if (player.g > 0) spawny += blockSize - playerSize;
  player.x = spawnx;
  player.y = spawny;
  drawLevel();
  drawPlayer();
  if (player.currentLevel === 46) {
    id("wjTip").style.bottom = `calc(100% - ${id("wjTip").clientHeight}px)`;
  } else {
    id("wjTip").style.bottom = "100%";
  }
}

function getBlockType(x, y) {
  let level = levels[player.currentLevel];
  if (x < 0 || x >= level.length || y < 0 || y >= level[0].length) {
    if (level[x - 1] != undefined) {
      if (typeof level[x - 1][y] == "object") {
        if (level[x - 1][y][0] == -1) {
          console.log([
            -2,
            level[x - 1][y][1],
            level[x - 1][y][2],
            level[x - 1][y][3]
          ])
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
function deepCopy(inObject) {
  //definitely not copied from somewhere else
  let outObject, value, key;
  if (typeof inObject !== "object" || inObject === null) {
    return inObject;
  }
  outObject = Array.isArray(inObject) ? [] : {};
  for (key in inObject) {
    value = inObject[key];
    outObject[key] = deepCopy(value);
  }
  return outObject;
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
function formatTime(ms, word = true) {
  let s = ms / 1000;
  let ds = s % 60;
  let m = Math.floor(s / 60);
  let dm = m % 60;
  let h = Math.floor(m / 60);
  let dh = h % 24;
  let d = Math.floor(h / 24);
  let dd = d % 30.43685;
  let mo = Math.floor(d / 30.43685);
  let dmo = mo % 12;
  let dy = Math.floor(mo / 365.2422);
  let time = "";
  if (word) {
    if (s < 60) {
      time = ds.toFixed(3) + " second" + pluralCheck(ds);
    } else {
      time = "and " + ds.toFixed(3) + " second" + pluralCheck(ds);
    }
    if (dm >= 1) time = dm + " minute" + pluralCheck(dm) + ", " + time;
    if (dh >= 1) time = dh + " hour" + pluralCheck(dh) + ", " + time;
    if (dd >= 1) time = dd + " day" + pluralCheck(dd) + ", " + time;
    if (dmo >= 1) time = dmo + " month" + pluralCheck(dmo) + ", " + time;
    if (dy >= 1) time = dy + " year" + pluralCheck(dy) + ", " + time;
    if (m < 60) time = time.replace(",", "");
    return time;
  } else {
    time = (ds < 10 ? "0" : "") + ds.toFixed(2);
    time = (dm < 10 ? "0" : "") + dm + ":" + time;
    if (dh >= 1) time = (dh < 10 ? "0" : "") + dh + ":" + time;
    if (dd >= 1) time = dd + ":" + time;
    if (dmo >= 1) time = dmo + ":" + time;
    if (dy >= 1) time = dy + ":" + time;
    return time;
  }
}
function save() {
  let saveData = deepCopy(player.spawnPoint);
  if (saveData[5] == Infinity) saveData[5] = "Infinity";
  localStorage.setItem("just-a-save" + diff, JSON.stringify(saveData));
}
function pluralCheck(n) {
  return n === 1 ? "" : "s";
}
var id = (x) => document.getElementById(x);

load();
respawn(false);
adjustScreen(true);
window.requestAnimationFrame(nextFrame);
setTimeout(drawLevel, 100);