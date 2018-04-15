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
    }

    /* Waiting Coroutine */
    waitForHub(eventName) {
        const hub = this.hub;

        return new Promise((resolve, reject) => {
            hub.once(eventName, resolve);
        });
    }
}
