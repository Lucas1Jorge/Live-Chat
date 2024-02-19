// ****************************
// ******* Match events *******
// ***** Enable listeners *****
// ****************************

function onJoinMatchButtonClicked() {
    sock.emit('joinMatch', {});
}

document
    .querySelector('#join-match-button')
    .addEventListener('click', onJoinMatchButtonClicked);



sock.on('joiningMatch', (json) => {
    if (json.isHost) {
        json.msg = `Joining chat...`;
        writeEvent(json);
        setSessionId('Host');
    }
    else {
        setSessionId('Guest-' + json.userId);
    }
    setMatchStatus('waiting');

    // userName = prompt(`Username (How you're seen by others):`);
    // setSessionId(userName);
    
    sock.emit('joinedMatch', {
        id: getSessionId(),
        color: getSessionColor(),
    })
})

function positionPlayers(numOfPlayers) {
    let idx = 0;
    const radius = Math.min(width, height) / 2;
    const center = createVector(width / 2, height / 2);
    for (key in playersDict) {
        let player = playersDict[key];
        let angleInRadians = 2 * Math.PI * idx / numOfPlayers;
        let radialDisplacement = (0.2 + 0.8 * random(1)) * radius;
        player.pos.x = center.x + radialDisplacement * cos(angleInRadians);
        player.pos.y = center.y + radialDisplacement * sin(angleInRadians);
        idx++;
    }
}

sock.on('startMatch', (json) => {
    let numOfPlayers = 0;
    playersDict = {};
    for (playerId in json.playersDict) {
        let playerUpdated = json.playersDict[playerId];
        let playerCopy = new Player(playerUpdated.id, playerUpdated.color);
        playersDict[playerId] = playerCopy;
        playersQueue[playerId] = [];
        numOfPlayers++;
    }
    positionPlayers(numOfPlayers);
    setMatchStatus('started');
});

sock.on('usersCnt', async (json) => {
    const displayElement = document.querySelector('#users-count');
    const content = `<spam color='#00ff00'>${json.count} online</spam>`;
    
    displayElement.innerHTML = content;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    displayElement.innerHTML = '';
})

sock.on('move', (json) => {
    if (json.id === sessionId)
        return;
    playersQueue[json.id].push(json);
})

function trimBuffer(id) {
    if (playersQueue[id].length > 20) {
        for (let i = 0; i < 5; i++) {
            playersQueue[id].shift();
        }
    }
    else if (playersQueue[id].length > 10) {
        playersQueue[id].shift();
    }
}

function updatePlayersMove() {
    for (id in playersQueue) {
        trimBuffer(id);

        if (playersQueue[id].length > 0) {
            let json = playersQueue[id][0];
            playersQueue[id].shift();
            let player = playersDict[id];
            player.pos.x = json.posX;
            player.pos.y = json.posY;
            player.angle = json.angle;
        }
    }
}

sock.on('shoot', (json) => {
    if (json.id === sessionId)
        return;
    // playersQueue[json.id].push(json);
    let player = playersDict[json.id];
    player.shoot();
})

sock.on('spawnEnemy', (enemy) => {
    if (getSessionId() !== 'Host') {
        let newZombie = new Zombie(enemy.speed);
        newZombie.id = enemy.id;
        newZombie.player = playersDict[enemy.playerId];
        newZombie.pos = createVector(enemy.x, enemy.y);
        zombies.push(newZombie);
        zombiesDict[newZombie.id] = newZombie;
    }
})

sock.on('killEnemy', (payload) => {
    delete zombiesDict[payload.zombieId];
});



// ****************************
// ******** Broadcasts ********
// ****************************

function broadCastMove() {
    sock.emit('move', {
        id: getSessionId(),
        posX: myPlayer.pos.x,
        posY: myPlayer.pos.y,
        angle: myPlayer.angle
    });
}

function broadCastShoot() {
    sock.emit('shoot', {
        id: getSessionId()
    });
}

function broadCastZombie(zombieId) {
    let latestZombie = zombiesDict[zombieId];
    let enemy = {
        id: latestZombie.id,
        speed: latestZombie.speed,
        playerId: latestZombie.player.userId,
        x: latestZombie.pos.x,
        y: latestZombie.pos.y
    };
    sock.emit('spawnEnemy', enemy);
}

function broadcastZombieDeath(zombieId) {
    sock.emit('killEnemy', zombieId);
}