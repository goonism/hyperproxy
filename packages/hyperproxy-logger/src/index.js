import Pino from 'pino';

export default class HyperproxyLogger extends Pino {

    constructor(name) {
        super({
            name,
            safe: true
        });
    }
}
