var playerSize = 20;
var blockSize = 50;

let canvas = document.getElementById("playerLayer");
let bcanv = document.getElementById("bgLayer");
let lvlCanvas = document.getElementById("levelLayer");
const play_norm = new Image()
play_norm.src = "static/mc_norm.png"

function onLoadPlay_norm(context,x,y,size){
  context.drawImage(play_norm, 0, 0, 64, 64,x, y, size, size )
}
const play_jump = new Image()
play_jump.src = "static/mc_jump.png"

function onLoadPlay_jump(context,x,y,size){
  context.drawImage(play_jump, 0, 0, 64, 64,x, y, size, size )
}

function drawPlayer() {
    let pL = canvas.getContext("2d");
    canvas.width = levels[player.currentLevel].length * blockSize; //calling player class 
    canvas.height = levels[player.currentLevel][0].length * blockSize;
    pL.clearRect(0, 0, canvas.width, canvas.height); //Resets it?
    let ratio = player.currentJumps / player.maxJumps; 
    if (player.maxJumps === Infinity) ratio = 1;
    if (player.maxJumps === 0) ratio = 0;
    if (ratio === 1 ){
      // pL.fillStyle = `#324376`;
      onLoadPlay_norm(pL,player.x, player.y, playerSize)
      } // Changing the Color 
    else{
      onLoadPlay_jump(pL,player.x, player.y, playerSize)
      // pL.fillStyle = `#FCFCFC`; // Changing the Color 
    }
    if (player.isDead) pL.fillStyle += "88";

    // pL.fillRect(
    //     Math.floor(player.x),
    //     Math.floor(player.y),
    //     playerSize,
    //     playerSize
    // );
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

    backContext.fillStyle = "rgba(255, 255, 255, .3)";
    

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
                const X_img = new Image();
                X_img.src = "static/gates/x.png";
                X_img.onload = () => {
                  backContext.drawImage( X_img, 0, 0, 64, 64,xb, yb, blockSize, blockSize )
                };
                break;
              case -5000:
                const T_img = new Image();
                if(player.solid == true) T_img.src = "static/gates/transparent.png";
                else T_img.src = "static/gates/solid.png";
                T_img.onload = () => {
                  layerContext.drawImage( T_img, 0, 0, 64, 64,xb, yb, blockSize, blockSize )
                };
                break;
              case 5000:
                  const S_img = new Image();
                  if(player.solid == true) S_img.src = "static/gates/solid.png";
                  else S_img.src = "static/gates/transparent.png";
                  S_img.onload = () => {
                    layerContext.drawImage( S_img, 0, 0, 64, 64,xb, yb, blockSize, blockSize )
                  };
                  break;
              case Y:
                const Y_img = new Image();
                Y_img.src = "static/gates/y.png";
                Y_img.onload = () => {
                  backContext.drawImage( Y_img, 0, 0, 64, 64,xb, yb, blockSize, blockSize )
                };
                break;
              case Z:
                const Z_img = new Image();
                Z_img.src = "static/gates/z.png";
                Z_img.onload = () => {
                  backContext.drawImage( Z_img, 0, 0, 64, 64,xb, yb, blockSize, blockSize )
                };
                break;
              case 1:
                const img = new Image()
                img.src = "static/blocks2.png"
                img.onload = () => {
                  layerContext.drawImage(img, 0, 0, 64, 64,xb, yb, blockSize, blockSize )
                }
                break;
              case 2:
                const img3 = new Image()
                img3.src = "static/death.png"
                img3.onload = () => {
                  layerContext.drawImage(img3, 0, 0, 64, 64,xb, yb, blockSize, blockSize )
                }
                break;
              case 3:
                if (isSpawn(x, y)) {
                  layerContext.fillStyle = "#00FFFF88";
                } else layerContext.fillStyle = "#00888888";
                const life = new Image();
                life.src = "static/life.png";
                life.onload = () => {
                  layerContext.drawImage(life, 0, 0, 64, 64,xb, yb, blockSize, blockSize )
                };
                break;
              case -9:
                layerContext.fillStyle = 'rgba(255,255,255,0)'
                backContext.fillStyle = "rgba(255, 255, 255, 0)";
                break;

              default:
                backContext.fillStyle = "rgba(255, 255, 255, .3)";
                layerContext.fillStyle = 'rgba(255,255,255,0)';
                break;
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
                // case 3:
                //   if (isSpawn(x, y)) {
                //     layerContext.strokeStyle = "#00888888";
                //   } else layerContext.strokeStyle = "#00444488";
                //   layerContext.beginPath();
                //   layerContext.moveTo(xb + (blockSize / 25) * 3, yb + blockSize / 2);
                //   layerContext.lineTo(xb + blockSize / 2, yb + blockSize - (blockSize / 25) * 3);
                //   layerContext.lineTo(
                //     xb + blockSize - (blockSize / 25) * 3,
                //     yb + (blockSize / 25) * 3
                //   );
                //   layerContext.stroke();
                //   break;
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