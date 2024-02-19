// ****************************
// ******** Team chat *********
// **** Receiving messages ****
// ****************************

function writeEvent(json) {
    // <ul> element
    const parent = document.querySelector('#events');
  
    // <li> element
    const el = document.createElement('li');
    const senderColor = json.color ? json.color : "#00ff00";
    // let text = `<b color="${senderColor}">${json.sender}:</b> ${json.msg}`
    let text = `<spam color="${senderColor}">${json.sender}:</spam> ${json.msg}`
    el.innerHTML = text;

    parent.appendChild(el);
}  
writeEvent({
    sender: `Sticky`,
    msg:`Welcome. Try the Sticky chat!`
});


// ****************************
// **** Writting messages *****
// ****************************

function onFormSubmitted(e) {
    e.preventDefault();
    
    const input = document.querySelector('#chat-input');
    const text = input.value;
    input.value = '';

    sock.emit('message', {
        sender: getSessionId(),
        color: getSessionColor(),
        msg: text
    });
}

document
    .querySelector('#chat-form')
    .addEventListener('submit', onFormSubmitted);



// ****************************
// ******* User typing ********
// ****************************

async function userTyping(json) {
    // e.preventDefault();
    if (json.sender === getSessionId())
        return;

    // const displayElement = document.querySelector('#chat-input');
    const displayElement = document.querySelector('#display-warnings');
    const prevText = displayElement.innerHTML;
    const newText = `<spam color="${json.color}">${json.sender} ${json.msg} ...</spam>`;

    if (json.msg === '') {
        displayElement.innerHTML = '';
        return;
    }

    if (prevText === '') {
        displayElement.innerHTML = newText;
        await new Promise((resolve) => setTimeout(resolve, 2200));
        displayElement.innerHTML = '';
    }

    // sock.emit('message', {
    //     sender: getSessionId(),
    //     color: getSessionColor(),
    //     msg: text
    // });
}

const chatInput = document.getElementById('chat-input');

chatInput.addEventListener('keydown', handleTyping);

function handleTyping(event) {
    sock.emit('typing', {
        sender: getSessionId(),
        color: getSessionColor(),
        msg: `is typing`
    });
}



const sock = io();
sock.on('message', writeEvent);
sock.on('typing', userTyping);