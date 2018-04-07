import "babel-polyfill";
import HyperproxyHubClient from 'hyperproxy-hub-client';

/* WINDOW EVENT */
window.addEventListener('load', init);

/* END WINDOW EVENT */

function init() {
    let activeURL,
        activeHash,
        shortHash;

    const client = new HyperproxyHubClient();

    const dataListEl = document.querySelector('#data');

    document.querySelector('#swarm-id').innerHTML = client.swarm.me;

    document.querySelector('#subscribe').addEventListener('click', () => {
        activeURL = document.querySelector('#daturl').value;

        activeHash = activeURL.substring(6);

        shortHash = activeHash.slice(0, 4) + '...' + activeHash.slice(-5);

        document.querySelector('#active-daturl').innerHTML = shortHash;

        document.querySelector('#send').disabled = false;

        client.hub.subscribe(activeURL).on('data', ({sender, message}) => {
            dataListEl.appendChild(createElement(`
                <li>${sender} @ ${shortHash} : ${message}</li>
            `));
        });
    });

    document.querySelector('#send').addEventListener('click', () => {
        const message = document.querySelector('#message').value;

        client.hub.broadcast(activeURL, {
            sender: client.swarm.me,
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
