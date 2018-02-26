'use strict';

var _uws = require('uws');

var _uws2 = _interopRequireDefault(_uws);

var _HyperProxy = require('./HyperProxy');

var _HyperProxy2 = _interopRequireDefault(_HyperProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebSocketServer = _uws2.default.Server;

var PORT = 9999;

var wss = new WebSocketServer({ port: PORT });
/////////////////////////////////////////////////
/*   */

function onConnection(ws) {

    // Data token
    var app = ws.upgradeReq.url.split('?')[0].split('#')[0].substring(1).split('/');

    console.log(app);
    console.log(ws.app);

    var hyperProxy = new _HyperProxy2.default(app);

    hyperProxy.once('connection', function (c) {
        wss.clients.forEach(function (client) {
            client.send(c);
        });
    });
}

wss.on('connection', onConnection);
wss.on('listening', function () {
    console.log('Signalhubws running on ' + PORT);
});