import Dat from 'dat-node';

//40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9
class HyperproxyNode {
    constructor(channelName) {
        this.datResolve = this._connectToDat(channelName);
        // TODO implement swarm @coldsauce https://github.com/goonism/hyperproxy/issues/6
    }

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

