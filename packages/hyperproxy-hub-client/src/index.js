import swarm from 'webrtc-swarm';
import signalhub from 'signalhubws';

import HyperProxyLogger from 'hyperproxy-logger';
import {HUB_NAME, HUB_URL} from 'hyperproxy-config';

const logger = new HyperProxyLogger('hyperproxy-hub');

export default class HyperproxyHubClient {

    constructor(wsClass, wrtc = null, name = HUB_NAME, url = HUB_URL) {
        this.hub = signalhub(name, [url], wsClass);
        this.swarm = wrtc
            ? swarm(this.hub, {wrtc})
            : swarm(this.hub);

        this.handleSwarmEvent();
    }

    /* Waiting Coroutine */
    waitForHub(eventName) {
        const hub = this.hub;

        return new Promise((resolve, reject) => {
            hub.once(eventName, resolve);
        });
    }

    /*
        Handle swarm event reporting
    */
    handleSwarmEvent() {
        const sw = this.swarm;

        /* Swarm Event */
        sw.on('close', function(e) {
            sw.close();
        });

        sw.on('message', function(m) {
            logger.info(m, 'NEW SWARM MESSAGE');
        });

        sw.on('peer', function(peer, id) {
            logger.info(id, 'NEW PEER CONNECTED');
            logger.info(sw.peers.length, 'TOTAL PEER');
        });

        sw.on('disconnect', function(peer, id) {
            logger.info(id, 'PEER DISCONNECTED');
            logger.info(sw.peers.length, 'TOTAL PEER');
        });
        /* END Swarm Event */
    }
}
