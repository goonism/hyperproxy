/*
    Return Hub Variable
*/

const HUB_NAME = 'hyperproxy';

const HUB_IP = process.env.HUB_IP || 'localhost';
const HUB_PORT = process.env.HUB_PORT || 9999;
const HUB_URL = process.env.LOCAL
    ? `ws://${HUB_IP}:${HUB_PORT}/`
    : `wss://hub.hyperproxy.network/`;

module.exports = Object.freeze({
    HUB_NAME,
    HUB_IP,
    HUB_PORT,
    HUB_URL,
    HUB_MSG_TYPE: {
        JOIN: 'JOIN',
        LEAVE: 'LEAVE',
        REQUEST: 'REQUEST',
        RESPONSE: 'RESPONSE',
    }
});
