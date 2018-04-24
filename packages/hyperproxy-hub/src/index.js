import WebSocket from 'uws';

import {HUB_PORT as port, HUB_MSG_TYPE} from 'hyperproxy-config';
import HyperProxyNode from 'hyperproxy-node';
import HyperProxyLogger from 'hyperproxy-logger';

const datMap = new Map();
const nodeMap = new Map();

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
            logger.info(jsond, 'Got message');

            if (jsond.message.type === HUB_MSG_TYPE.JOIN) {
                logger.info('received a JOIN event');

                if (!datMap[jsond.channel]) {
                    logger.info(jsond.channel, 'spawn new hyperproxy-node');
                    const nodeInstance = new HyperProxyNode(jsond.channel);

                    //TODO: Extends this to be a more generic object that has peer ID
                    datMap[jsond.channel] = {
                        [nodeInstance.client.swarm.me]: true,
                        [jsond.message.from]: true
                    };
                    nodeMap[jsond.channel] = nodeInstance;
                } else {
                    datMap[jsond.channel][jsond.message.from] = true;
                    return;
                }
            }

            if (jsond.message.type === HUB_MSG_TYPE.LEAVE) {
                logger.info('received a LEAVE event');
                delete datMap[jsond.channel][jsond.message.from];
                if (Object.keys(datMap[jsond.channel]).length === 1) {
                    nodeMap[jsond.channel].close();
                    delete nodeMap[jsond.channel];
                    delete datMap[jsond.channel];
                }

            }
        }

        wss
            .clients
            .forEach((client) => {
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
