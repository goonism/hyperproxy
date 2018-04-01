const swarm = require('webrtc-swarm');
const signalhub = require('signalhubws');

const hub = signalhub('hyperproxy', [
    'ws://127.0.0.1:9999',
    'wss://bfnfjzdkbd.localtunnel.me'
]);

const sw = swarm(hub);

/* Swarm Event */
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
/* END Swarm Event */

/* WINDOW EVENT */
window.addEventListener('load', init);

/* END WINDOW EVENT */

function init() {
    let activeURL,
        activeHash,
        shortHash;

    document.querySelector('#swarm-id').innerHTML = sw.me;

    const dataListEl = document.querySelector('#data');

    document.querySelector('#subscribe').addEventListener('click', () => {
        activeURL = document.querySelector('#daturl').value;

        activeHash = activeURL.substring(6);

        shortHash = activeHash.slice(0, 4) + '...' + activeHash.slice(-5);

        document.querySelector('#active-daturl').innerHTML = shortHash;

        document.querySelector('#send').disabled = false;

        hub.subscribe(activeURL).on('data', ({sender, message}) => {
            dataListEl.appendChild(createElement(`
                <li>${sender} @ ${shortHash} : ${message}</li>
            `));
        });
    });

    document.querySelector('#send').addEventListener('click', () => {
        const message = document.querySelector('#message').value;

        hub.broadcast(activeURL, {
            sender: sw.me,
            message
        });
    });
}

// Create html element. Code adapted from
// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function createElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
