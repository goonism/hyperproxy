import swarm from 'webrtc-swarm';
import signalhub from 'signalhubws';

import {HUB_NAME, HUB_URL} from 'hyperproxy-config';

export default class HyperproxyHubClient {

    constructor(wrtc = null, name = HUB_NAME, url = HUB_URL) {
        this.hub = signalhub(name, [url]);
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
            console.log(m);
        });

        sw.on('peer', function(peer, id) {
            console.log('connected to a new peer:', id);
            console.log('total peers:', sw.peers.length);
        });

        sw.on('disconnect', function(peer, id) {
            console.log('disconnected from a peer:', id);
            console.log('total peers:', sw.peers.length);
        });
        /* END Swarm Event */
    }
}
