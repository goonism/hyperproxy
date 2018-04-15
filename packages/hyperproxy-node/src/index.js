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

// TODO: Remove this commented out code @lgvichy
// https://github.com/goonism/hyperproxy/issues/7
// 40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9
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

        await client.waitForHub('connect')
        client.hub.broadcast(key, {
            from: client.swarm.me,
            type: HUB_MSG_TYPE.JOIN
        });
    }

    _getPeerFrom(peerKey, peers) {
        // peers.filter(peer => peer. == peerkKey)
    }
    /*
        Handle any peer data by getting them from TCP/UDP dat
    */
    async _handleData(client, key, {from, body, type}) {
        if (type === HUB_MSG_TYPE.RESPONSE) {
            return;
        }

        if (type === HUB_MSG_TYPE.REQUEST) {

            console.log("DDDDDDDDDDDDDDDDDDD");
            console.log(client.swarm.peers);
            console.log(client.swarm);
            console.log("DDDDDDDDDDDDDDDDDDD");

            const file = await this.readFile(body);
            // TODO @lgvichy https://github.com/goonism/hyperproxy/issues/24

            const payload = JSON.stringify({
                from: client.swarm.me,
                type: HUB_MSG_TYPE.RESPONSE,
                body: file
            });

            console.log(client.swarm);
            console.log(client.swarm.remotes[from]);

            client.swarm.remotes[from].send(Buffer.from(payload));

            // client.hub.broadcast(key, {
            //     from: client.swarm.me,
            //     type: HUB_MSG_TYPE.RESPONSE,
            //     body: file
            // });
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

// TODO: Remove this commented out code @lgvichy
// https://github.com/goonism/hyperproxy/issues/7 const hp = new
// HyperproxyNode('40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9');
