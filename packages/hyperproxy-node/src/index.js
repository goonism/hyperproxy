import Dat from 'dat-node';
import Swarm from 'webrtc-swarm';
import SignalHub from 'signalhubws';
import HyperproxyHubClient from 'hyperproxy-hub-client';
import Wrtc from 'wrtc';
import {w3cwebsocket as WebSocket} from 'websocket';

import {HUB_MSG_TYPE} from 'hyperproxy-config';

// TODO: Remove this commented out code @lgvichy
// https://github.com/goonism/hyperproxy/issues/7
// 40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9
export default class HyperproxyNode {
    constructor(channelName) {
        this.datResolve = this._connectToDat(channelName);
        this._connectToHub(channelName);
    }

    async readFile(fileName) {
        await this.datResolve;
        return new Promise((resolve, reject) => {
            this
                .dat
                .archive
                .readFile(fileName, (err, content) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(content);
                });
        });
    }

    async _connectToHub(key) {
        const client = new HyperproxyHubClient(WebSocket, Wrtc);
        client
            .hub
            .subscribe(key)
            .on('data', (data) => this._handleData(client, key, data));
    }

    async _handleData(client, key, {from, body, type}) {
        try {
            if (type === HUB_MSG_TYPE.RESPONSE) {
                return;
            }

            if (type === HUB_MSG_TYPE.REQUEST) {
                const file = await this.readFile(body);
                // TODO @lgvichy https://github.com/goonism/hyperproxy/issues/24
                client
                    .hub
                    .broadcast(key, {
                        from: client.swarm.me,
                        type: HUB_MSG_TYPE.RESPONSE,
                        body: file
                    });
            }
        } catch (err) {
            console.error("ERROR in hyperproxy-node! ", err);
            return;
        }
    }

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
