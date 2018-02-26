import NativeSwarm from 'discovery-swarm';

/*
    hyperproxy

*/
export default class HyperProxy extends EventEmitter {
    constructor(id) {
        this.nativeSwarm = NativeSwarm();

        this.nativeSwarm.join(id);

        this.nativeSwarm.on('connection', (c) => this.emit('connection', c));
    }

    send() {

    }
}
