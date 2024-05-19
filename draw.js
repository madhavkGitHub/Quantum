var playerSize = 20;
var blockSize = 50;
var X = -2000
var Y = -3000
var Z = -4000
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

    lvlCanvas.width = levels[player.currentLevel].length * blockSize;
    lvlCanvas.height = levels[player.currentLevel][0].length * blockSize;
    bcanv.width = levels[player.currentLevel].length * blockSize;
    bcanv.height = levels[player.currentLevel][0].length * blockSize;

    layerContext.clearRect(0, 0, lvlCanvas.width, lvlCanvas.height);
    backContext.clearRect(0, 0, lvlCanvas.width, lvlCanvas.height);

    backContext.fillStyle = "rgba(255, 255, 255, 0)";
    

    for (let x in levels[player.currentLevel]){
        for (let y in levels[player.currentLevel][x]){
            layerContext.lineWidth = (blockSize * 3)/25;
            let xb = x*blockSize;
            let yb = y*blockSize;
            let type = getBlockType(x, y);
            let props = type;
            if (typeof type === "object") type = type[0];
            switch(type){

            case X:
              if (!player.triggers.includes(props[1])) {
                layerContext.fillStyle = "#00880088";
              } else layerContext.fillStyle = "#00880088";
              break;
            case Y:
              if (!player.triggers.includes(props[1])) {
                layerContext.fillStyle = "#D991BA";
              } else layerContext.fillStyle = "#D991BA";
              break;
            case Z:
              if (!player.triggers.includes(props[1])) {
                layerContext.fillStyle = "#D991BA";
              } else layerContext.fillStyle = "#D991BA";
              break;
            case 1:
              const img = new Image();
              img.src = "static/blocks.png";
              img.onload = () => {
                const pattern = layerContext.createPattern(img, "no-repeat");
                layerContext.fillStyle = pattern;
                layerContext.fillRect(xb, yb, blockSize, blockSize);
              };
              //layerContext.fillStyle = "#000000";
              break;
            case 2:
              // const img2 = new Image();
              // img2.src = "static/capy_button.png";
              // img2.onload = () => {
              //   const pattern = layerContext.createPattern(img2, "repeat");
              //   layerContext.fillStyle = pattern;
              //   layerContext.fillRect(xb, yb, blockSize, blockSize);
              // };
              layerContext.fillStyle = "rgba(214, 50, 48, 1)"//"#FF0000";
              break;
            case 3:
              if (isSpawn(x, y)) {
                layerContext.fillStyle = "#00FFFF88";
              } else layerContext.fillStyle = "#00FFFF88";
              break;

            default:
              layerContext.fillStyle = 'rgba(255,255,255,0.2)';
            }
            
            layerContext.fillRect(xb, yb, blockSize, blockSize);
            backContext.fillRect(xb, yb, blockSize, blockSize);
            switch(type){
              case 2:
                layerContext.strokeStyle = "#880000";
                layerContext.beginPath();
                layerContext.moveTo(xb + (blockSize / 25) * 3, yb + (blockSize / 25) * 3);
                layerContext.lineTo(
                  xb + blockSize - (blockSize / 25) * 3,
                  yb + blockSize - (blockSize / 25) * 3
                );
                layerContext.stroke();
      
                layerContext.beginPath();
                layerContext.moveTo(
                  xb + (blockSize / 25) * 3,
                  yb + blockSize - (blockSize / 25) * 3
                );
                layerContext.lineTo(
                  xb + blockSize - (blockSize / 25) * 3,
                  yb + (blockSize / 25) * 3
                );
                layerContext.stroke();
                break;
                case 3:
                  if (isSpawn(x, y)) {
                    layerContext.strokeStyle = "#00888888";
                  } else layerContext.strokeStyle = "#00444488";
                  layerContext.beginPath();
                  layerContext.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
                  layerContext.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
                  layerContext.lineTo(
                    xb + blockSize - (blockSize / 25) * 3,
                    yb + (blockSize / 25) * 3
                  );
                  layerContext.stroke();
                  break;
                default:
                  break;
            }
            
        }
    }
    adjustScreen();
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