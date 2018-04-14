/*
    Return Hub Variable
*/

const IP = process.env.IP || process.env.NODE_IP || '0.0.0.0';
const PORT = process.env.PORT || process.env.NODE_PORT || 9999;

// Construct hub url based on environment
function getHubURL() {
    if (process.env.LOCAL) {
        return `ws://localhost:${PORT}`;
    }
    else {
        return `ws://${IP}`;
    }
}

module.exports = Object.freeze({
    HUB_PORT: PORT,
    HUB_NAME: 'hyperproxy',
    HUB_URL: getHubURL(),
    HUB_MSG_TYPE: {
        JOIN: 'JOIN',
        REQUEST: 'REQUEST',
        RESPONSE: 'RESPONSE',
        DISCONNECT: 'DISCONNECT'
    }
});
