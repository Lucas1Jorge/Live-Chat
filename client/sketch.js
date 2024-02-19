let myPlayer;
let sessionId;

let players = [];
let playersDict = {};
let playersQueue = {};

function setup() {
  createCanvas(700, 700);
  imageMode(CENTER);
  playersDict = {};
  players = []
  for (i of [0, 1]) {
    players.push(new Player());
    playersDict[i] = new Player();
  }
  stickyImg = loadImage("./assets/sticky.jpeg");

  // userName = prompt(`Username (How you're seen by others):`);
  // setSessionId(userName);
  
  zoom = 1.4;
  sessionId = "New Session";
}

function showLoadingScreen() {
  document.getElementsByClassName('dot-flashing')[0].style.display = 'block';
  document.getElementsByClassName('join-match-button')[0].style.display = 'block';
  document.getElementsByClassName('chat-form')[0].style.display = 'none';
  document.getElementsByClassName('users-count')[0].style.display = 'none';
}

async function hideLoadingScreen() {
  document.getElementsByClassName('dot-flashing')[0].style.display = 'none';
  document.getElementsByClassName('join-match-button')[0].style.display = 'none';
  document.getElementsByClassName('chat-form')[0].style.display = 'block';
  document.getElementsByClassName('users-count')[0].style.display = 'block';
}

async function draw() {
  if (!checkMatchStarted()) {
    showLoadingScreen();

    // image(stickyImg, 100, 100, width / 5, height / 5);
    return;
  }
  
  // Start match if all players connected
  await hideLoadingScreen();
  sessionId = getSessionId();

  return;
}