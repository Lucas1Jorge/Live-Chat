const axios = require('axios');

async function login(username, password) {
    // const url = `https://localhost:4567/api/login`;
    // const url = `https://localhost:4567/api/register`;
    const url = `https://try.nodebb.org/api/login`;
    // const url = `https://try.nodebb.org/api/register`;
    const payload = {
        username,
        password
    };

    const response = await axios({ method: 'GET', url, data: payload, headers: undefined });

    return response;
}

module.exports = { login };