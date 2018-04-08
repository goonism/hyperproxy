/*
    Return Hub Variable
*/

// This variable can be toggled on/off for local development.
const LOCAL = true;

const PORT = process.env.PORT || process.env.NODE_PORT || 9999;

// Construct hub url based on environment
function getHubURL() {
    if (LOCAL) {
        return `ws://localhost:${PORT}`;
    }
    else {
        return 'wss://hyperproxy-hub-nsspddnqun.now.sh';
    }
}

module.exports = Object.freeze({
    HUB_PORT: PORT,
    HUB_NAME: 'hyperproxy',
    HUB_URL: getHubURL()
});
