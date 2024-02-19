const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { connect } = require('http2');
const axios = require('axios');
const { login } = 
require('./authentication.js');

// ****************************
// *********** Utils **********
// ****************************

function generateRandomHash(length=4) {
    const chars = '0123456789abcdef';
    let hash = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        hash += chars[randomIndex];
    }
    
    return hash;
}

// ****************************
// ****** Socket server: ******
// ****************************

const app = express();
let filePath = `${__dirname}/../client/`;
app.use(express.static(filePath));

const server = http.createServer(app);
const io = socketio(server);

minNumOfPlayers = 1;
let playersCnt = 0;
let usersCnt = 0;
let playersSockets = [];
let playersDict = {};

function newServerMsg(jsonArgs) {
    return {
        sender: 'Server',
        ...jsonArgs
    }
}

io.on('connection', (sock) => {
    console.log(`new User connected`);
    usersCnt++;

    playersSockets.push(sock);

    sock.on('joinMatch', (json) => {
        let isHost = playersCnt === 0 ? true : false;
        sock.emit('joiningMatch', newServerMsg({
            'isHost': isHost,
            userId: generateRandomHash()
        }));
    });

    sock.on('joinedMatch', (json) => {
        playersCnt++;
        
        io.emit('usersCnt', {
            count: usersCnt
        });
        
        console.log(`Joined confirmed. ${playersCnt} connected players`);
        playersDict[json.id] = json;

        playersSockets.forEach(playerSocket => playerSocket.emit('message', newServerMsg({
            msg: `Joined Sticky chat`
        })));
        io.emit('startMatch', newServerMsg({
        // sock.emit('startMatch', newServerMsg({
            'playersDict': playersDict
        }));
        playersSockets = [];
        playersDict = {};
    })

    sock.on('message', async (text) => {
        io.emit('message', newServerMsg(text));
        console.log(`\n***** Chat message: ${JSON.stringify(text.msg)} *****\n`);

        const get = 'GET';
        const post = 'POST';
        // const url = 'localhost:4567';
        const url = 'http://0.0.0.0:4567/users';
        const url2 = 'http://0.0.0.0:4567/chats/';
        const url3 = 'http://localhost:4567/api/v3/chats/';
        const url4 = `https://try.nodebb.org/api/v3/chats/`;
        const data = {
            // "uids": [
            //     2
            // ]
        };
        const headers = undefined;

        // const loginAttempt = await login('lucas@getstic.ky', 'test@123');

        // const response = await axios({ method: get, url, data: undefined, headers });
        // const response = await axios({ method: get, url: url4, data: undefined, headers });
            // .then(response => {
            //     console.log(`\n***** Axios response: *****\n`);
            //     console.log(response.data);
            // })
            // .catch(error => {
            //     console.log(`\n***** Axios ERROR: *****\n`);
            //     console.error('Error:', error);
            // });
        
        // console.log(response);
    })

    sock.on('typing', (json) => {
        io.emit('typing', newServerMsg(json));
    });

    sock.on('move', (json) => {
        playersDict[json.id] = json.player;
        json.playersDict = playersDict
        io.emit('move', newServerMsg(json));
    });

    sock.on('shoot', (json) => {
        io.emit('shoot', newServerMsg(json));
    });

    sock.on('spawnEnemy', (json) => {
        io.emit('spawnEnemy', newServerMsg(json));
    });

    sock.on('killEnemy', (zombieId) => {
        io.emit('killEnemy', newServerMsg({
            zombieId: zombieId
        }));
    });

    sock.on('disconnect', (reason) => {
        usersCnt--;
        io.emit('usersCnt', {
            count: usersCnt
        });
        console.log('User disconnected:', reason);
    });
})

server.on('error', (err) => {
    console.error('Server error:', err);
})

server.listen(8000, () => {
  console.log('Server started on port 8000');
});