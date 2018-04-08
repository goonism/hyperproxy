import WebSocket from 'uws';

import {HUB_PORT as port, HUB_MSG_TYPE} from 'hyperproxy-config';
import HyperProxyNode from 'hyperproxy-node';

const datMap = new Map();

const wss = new WebSocket.Server({port});

function onConnection(ws) {

    // Data token
    const app = ws
        .upgradeReq
        .url
        .split('?')[0]
        .split('#')[0]
        .substring(1)
        .split('/');

    console.log('CONNECTED TO APP: ', app);

    ws.app = app[app.length - 1];

    ws.on('message', (data) => {
        let jsond;
        try {
            jsond = JSON.parse(data);
        } catch (e) {
            console.error(e.message);
            return;
        }

        console.log('Got message', jsond);

        // if not all channel and no HyperProxy-node has been assigned
        if (jsond.channel !== 'all' && jsond.message.type === HUB_MSG_TYPE.JOIN) {
            if (!datMap[jsond.channel]) {
                datMap[jsond.channel] = new HyperProxyNode(jsond.channel);
            }

            return;
        }

        wss
            .clients
            .forEach((client) => {
                if (jsond.app === client.app) {
                    console.log('Broadcasting on app: %s', client.app);
                    client.send(data);
                }
            });
    });
}

wss.on('connection', onConnection);
wss.on('listening', function() {
    console.log(`HyperProxy Hub running on ${port}`);
});
