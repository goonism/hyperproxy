import WebSocket from 'uws';
import HyperProxy from './HyperProxy';

const WebSocketServer = WebSocket.Server;

const PORT = 9999;

const wss = new WebSocketServer({port: PORT});
/////////////////////////////////////////////////
/*   */

function onConnection(ws) {

    // Data token
    const query = ws.upgradeReq.url.split('?')[0].split('#')[0].substring(1).split('/');

    const app = query[query.length - 1];

    console.log(app);

    console.log(ws);
    
    console.log(wss);

    const hyperProxy = new HyperProxy(app);

    hyperProxy.on('connection', (c)=> {
        console.log(c);
        wss.clients.forEach((client) => {
            client.send(c);
        });
    });
}

wss.on('connection', onConnection);
wss.on('listening', function() {
    console.log(`Signalhubws running on ${PORT}`);
});
