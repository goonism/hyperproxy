import Pino from 'pino';

export default class HyperproxyLogger extends Pino {

    constructor(name) {

        const pretty = Pino.pretty();

        pretty.pipe(process.stdout);

        super({
            name,
            safe: true
        }, pretty);
    }
}
