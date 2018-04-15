import Pino from 'pino';
import WebSocket from 'uws';

import {HUB_PORT as port, HUB_MSG_TYPE} from 'hyperproxy-config';
import HyperProxyNode from 'hyperproxy-node';

const datMap = new Map();

const wss = new WebSocket.Server({port});

const pretty = Pino.pretty();
pretty.pipe(process.stdout);
const logger = Pino({
    name: 'hyperproxy-hub',
    safe: true
}, pretty);

function onConnection(ws) {

    // Data token
    const app = ws.upgradeReq.url.split('?')[0].split('#')[0].substring(1).split('/');

    logger.info(app, 'CONNECTED TO APP');

    ws.app = app[app.length - 1];

    ws.on('message', (data) => {
        let jsond;
        try {
            jsond = JSON.parse(data);
        } catch (e) {
            logger.error(e.message);
            return;
        }

        logger.info(jsond, 'NEW WEBSOCKET MESSAGE');

        // if not all channel and no HyperProxy-node has been assigned
        if (jsond.channel !== 'all' && jsond.message.type === HUB_MSG_TYPE.JOIN) {
            if (!datMap[jsond.channel]) {
                logger.info(jsond.channel, 'SPAWN NEW HYPERPROXY NODE');
                datMap[jsond.channel] = new HyperProxyNode(jsond.channel);
            }

            return;
        }

        wss.clients.forEach((client) => {
            if (jsond.app === client.app) {
                logger.info('BROADCASTING ON APP: %s', client.app);
                client.send(data);
            }
        });
    });
}

wss.on('connection', onConnection);
wss.on('listening', function() {
    logger.info(`HyperProxy Hub running on ${port}`);
});
