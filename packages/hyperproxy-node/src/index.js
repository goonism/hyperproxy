import Pino from 'pino';
import Dat from 'dat-node';
import Swarm from 'webrtc-swarm';
import SignalHub from 'signalhubws';
import Wrtc from 'wrtc';
import {w3cwebsocket as WebSocket} from 'websocket';

import HyperproxyHubClient from 'hyperproxy-hub-client';
import HyperProxyLogger from 'hyperproxy-logger';
import {HUB_MSG_TYPE} from 'hyperproxy-config';

const logger = new HyperProxyLogger('hyperproxy-hub');

export default class HyperproxyNode {
    constructor(channelName) {
        try {
            this.datResolve = this._connectToDat(channelName);
            this._connectToHub(channelName);
        } catch (e) {
            logger.error(e, 'constructor failed');
        }
    }

    /*
        Read a file from the subscribed dat archive asyncornously
    */
    async readFile(fileName) {
        await this.datResolve;
        return new Promise((resolve, reject) => {
            this.dat.archive.readFile(fileName, (err, content) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(content);
            });
        });
    }

    /*
        Connect to the hub under the specified key.
    */
    async _connectToHub(key) {
        const client = new HyperproxyHubClient(WebSocket, Wrtc);
        client.hub.subscribe(key).on('data', (data) => {
            try {
                this._handleData(client, key, data);
            } catch (e) {
                logger.error(e, 'cannot handle data');
            }
        });
    }

    /*
        Handle any peer data by getting them from TCP/UDP dat
    */
    async _handleData(client, key, {from, body, type}) {
        if (type === HUB_MSG_TYPE.RESPONSE) {
            return;
        }

        if (type === HUB_MSG_TYPE.REQUEST) {
            const file = await this.readFile(body);
            client.hub.broadcast(key, {
                from: client.swarm.me,
                type: HUB_MSG_TYPE.RESPONSE,
                body: file
            });
        }
    }

    /*
        Connect to the main dat archive
    */
    _connectToDat(key) {
        const datConfig = {
            key,
            temp: true,
            sparse: true
        };
        return new Promise((resolve, reject) => {
            // 1. Tell Dat where to download the files
            Dat(`./tmp/storage/${key}`, datConfig, (err, dat) => {
                if (err) {
                    reject(err);
                    return;
                }
                // 3. Join the network & download (files are automatically downloaded)
                dat.joinNetwork();
                this.dat = dat;
                resolve(dat);
            });
        });
    }
}