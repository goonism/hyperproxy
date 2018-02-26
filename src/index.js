import Debug from 'debug';
import WebSocket from 'uws';
import HyperProxy from './HyperProxy';

const debug = Debug('HyperProxyServer');
const debugError = Debug('HyperProxyServer:Error');
const WebSocketServer = WebSocket.Server;

const PORT = 9999;

const wss = new WebSocketServer({port: PORT});
/////////////////////////////////////////////////
/*   */

function onConnection(ws) {

    // Data token
    const app = ws.upgradeReq.url.split('?')[0].split('#')[0].substring(1).split('/');

    debug(app);
    debug(ws.app);

    const hyperProxy = new HyperProxy(app);

    hyperProxy.once('connection', (c)=> {
        wss.clients.forEach((client) => {
            client.send(c);
        });
    });
}

wss.on('connection', onConnection);
wss.on('listening', function() {
    console.log('Signalhubws running on %s', PORT);
});
