/*
    Return Hub Variable
*/

const HUB_IP = process.env.HUB_IP || 'localhost';
const HUB_PORT = process.env.HUB_PORT || 9999;

console.log(HUB_IP, HUB_PORT);

// Construct hub url based on environment
function getHubURL() {
    if (process.env.LOCAL) {
        return `ws://${HUB_IP}:${PORT}`;
    }
    else {
        return `ws://${HUB_IP}`;
    }
}

module.exports = Object.freeze({
    HUB_IP,
    HUB_PORT,
    HUB_NAME: 'hyperproxy',
    HUB_URL: getHubURL(),
    HUB_MSG_TYPE: {
        JOIN: 'JOIN',
        REQUEST: 'REQUEST',
        RESPONSE: 'RESPONSE',
        DISCONNECT: 'DISCONNECT'
    }
});
