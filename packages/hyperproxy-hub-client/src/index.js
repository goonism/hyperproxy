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

        sw.on('data', function(m) {
            console.log(m);
        });

        sw.on('message', function(m) {
            logger.info(m, 'new swarm message');
        });

        sw.on('peer', function(peer, id) {
            logger.info(id, 'peer connected');
            logger.info(sw.peers.length, 'total peers');
        });

        sw.on('disconnect', function(peer, id) {
            logger.info(id, 'peer disconnected');
            logger.info(sw.peers.length, 'total peers');
        });
        /* END Swarm Event */
    }
}
