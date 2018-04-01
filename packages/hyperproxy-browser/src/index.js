var swarm = require('webrtc-swarm');
var signalhub = require('signalhubws');

var hub = signalhub('dat://7235b8fdbb967d1b0b8e9fe3bbed54acc3fa3c8ed58ff55af1a66ab2d2e5aba1', ['ws://127.0.0.1:34234']);

var sw = swarm(hub);

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
