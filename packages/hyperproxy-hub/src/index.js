import WebSocket from 'uws';

import {HUB_PORT as port, HUB_MSG_TYPE} from 'hyperproxy-config';
import HyperProxyNode from 'hyperproxy-node';
import HyperProxyLogger from 'hyperproxy-logger';

const datMap = new Map();

const wss = new WebSocket.Server({port});

const logger = new HyperProxyLogger('hyperproxy-hub');

function onConnection(ws) {

    // Data token
    const app = ws.upgradeReq.url.split('?')[0].split('#')[0].substring(1).split('/');

    logger.info(app, 'connected');

    ws.app = app[app.length - 1];

    ws.on('message', (data) => {
        let jsond;
        try {
            jsond = JSON.parse(data);
        } catch (e) {
            logger.error(e.message);
            return;
        }

        // if not all channel and no HyperProxy-node has been assigned
        if (jsond.channel !== 'all') {
            console.log('Got message', jsond);
            if (jsond.message.type === HUB_MSG_TYPE.JOIN) {
                if (!datMap[jsond.channel]) {
                    logger.info(jsond.channel, 'spawn new hyperproxy-node');
                    const nodeInstance = new HyperProxyNode(jsond.channel);

                    //TODO: Extends this to be a more generic object that has peer ID
                    datMap[jsond.channel] = nodeInstance.client.swarm.me;
                }

                ws.send(JSON.stringify({
                    type: 'NODE_ID',
                    nodeid: datMap[jsond.channel]
                }));
            }

            return;
        }

        wss.clients.forEach((client) => {
            if (jsond.app === client.app) {
                logger.info(client.app, 'broadcasting');
                client.send(data);
            }
        });

    });
}

wss.on('connection', onConnection);
wss.on('listening', function() {
    logger.info(`hyperproxy-hub running on ${port}`);
});
