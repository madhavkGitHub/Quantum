var playerSize = 20;
var blockSize = 50;
let canvas = document.getElementById("playerLayer");
let bcanv = document.getElementById("bgLayer");
let lvlCanvas = document.getElementById("levelLayer");

function drawPlayer() {
    let pL = canvas.getContext("2d");
    canvas.width = levels[player.currentLevel].length * blockSize; //calling player class 
    canvas.height = levels[player.currentLevel][0].length * blockSize;
    pL.clearRect(0, 0, canvas.width, canvas.height); //Resets it?
    let ratio = player.currentJumps / player.maxJumps; 
    if (player.maxJumps === Infinity) ratio = 1;
    if (player.maxJumps === 0) ratio = 0;
    pL.fillStyle = `rgb(${255 - ratio * 255},0,${ratio * 255})`; // Changing the Color 
    if (options.darkMode)
        pL.fillStyle = `rgb(${255 - ratio * 255 * 0.75},${255 * 0.25},${
        ratio * 255 * 0.75 + 255 * 0.25
        })`;
    if (player.isDead) pL.fillStyle += "88";
    pL.fillRect(
        Math.floor(player.x),
        Math.floor(player.y),
        playerSize,
        playerSize
    );
    adjustScreen();
}

function drawLevel() {
    let layerContext = lvlCanvas.getContext("2d");
    let backContext = bcanv.getContext("2d");
    canvas.width = levels[player.currentLevel].length * blockSize;
    canvas.height = levels[player.currentLevel][0].length * blockSize;
    bcanv.width = levels[player.currentLevel].length * blockSize;
    bcanv.height = levels[player.currentLevel][0].length * blockSize;
    layerContext.clearRect(0, 0, canvas.width, canvas.height);
    backContext.clearRect(0, 0, canvas.width, canvas.height);
    backContext.fillStyle = "#FFFFFF";
    for (let x in levels[player.currentLevel]){
        for (let y in levels[player.currentJumps]){
            layerContext.lineWidth = (blockSize * 3)/25;
            let xb = x*blockSize;
            let yb = y*blockSize;
            let type = getBlockType(x, y);
            let props = type;
            if (typeof type === "object") type = type[0];
            switch(type){
                case 1:
                    layerContext.fillStyle = "#00880088";
                default:
                    layerContext.fillStyle = "#00000000";
            }
        }
    }
}

var lvlx = 0;
var lvly = 0;
var camx = 0;
var camy = 0;
var camDelay = 15;
function adjustScreen(instant = false) { //Camera mechanics 
  lvlx = Math.floor(
    (window.innerWidth - levels[player.currentLevel].length * blockSize) / 2
  );
  if (lvlx < 0) {
    lvlx =
      Math.floor(window.innerWidth / 2) - Math.floor(player.x + playerSize / 2);
    if (lvlx > 0) lvlx = 0;
    if (
      lvlx <
      window.innerWidth - levels[player.currentLevel].length * blockSize
    )
      lvlx = Math.floor(
        window.innerWidth - levels[player.currentLevel].length * blockSize
      );
  }
  lvly = Math.floor(
    (window.innerHeight - levels[player.currentLevel][0].length * blockSize) / 2
  );
  if (lvly < 0) {
    lvly =
      Math.floor(window.innerHeight / 2) -
      Math.floor(player.y + playerSize / 2);
    if (lvly > 0) lvly = 0;
    if (
      lvly <
      window.innerHeight - levels[player.currentLevel][0].length * blockSize
    )
      lvly = Math.floor(
        window.innerHeight - levels[player.currentLevel][0].length * blockSize
      );
  }
  camx = (camx * (camDelay - 1) + lvlx) / camDelay;
  camy = (camy * (camDelay - 1) + lvly) / camDelay;
  if (Math.abs(camx - lvlx) < 1 || instant) camx = lvlx;
  if (Math.abs(camy - lvly) < 1 || instant) camy = lvly;
  bcanv.style.left = camx + "px";
  bcanv.style.top = camy + "px";
  canvas.style.left = camx + "px";
  lvlCanvas.style.left = camx + "px";
  canvas.style.top = camy + "px";
  lvlCanvas.style.top = camy + "px";
}