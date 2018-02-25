import DiscoverySwarm from 'discovery-swarm';

/*
    hyperproxy

*/
export default class HyperProxy extends EventEmitter {
    constructor(){
        this.swarm = DiscoverySwarm();
    }


}
