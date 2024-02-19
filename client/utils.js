function getRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const colorCode = `#${randomColor.padStart(6, '0')}`;
    return colorCode;
}

function getSessionInfo() {
    const sessionInfo = document.querySelector('#sessionId');
    return sessionInfo.innerHTML;
}

function getSessionId() {
    let sessionInfoJSON = getSessionInfo();
    let sessionInfo = JSON.parse(sessionInfoJSON);
    return sessionInfo.id;
}

function getSessionColor() {
    let sessionInfoJSON = getSessionInfo();
    let sessionInfo = JSON.parse(sessionInfoJSON);
    return sessionInfo.color;
}

function setSessionId(newId) {
    const id = document.querySelector('#sessionId');
    id.innerHTML = `{ "id": "${newId}", "color": "${getRandomHexColor()}" }`;
}

function getMatchStatus() {
    const matchStatus = document.querySelector('#matchStatus');
    return matchStatus.innerHTML;
}

function setMatchStatus(newStatus) {
    const matchStatus = document.querySelector('#matchStatus');
    matchStatus.innerHTML = newStatus;
}

function checkMatchStarted() {
    const matchStatus = document.querySelector('#matchStatus');
    return matchStatus.innerHTML === 'started';
}