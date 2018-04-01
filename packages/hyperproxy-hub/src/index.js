import WebSocket from 'uws';

const port = 9999;

const wss = new WebSocket.Server({port});

function onConnection(ws) {

    // Data token
    const app = ws.upgradeReq.url.split('?')[0].split('#')[0].substring(1).split('/');

    console.log('CONNECTED TO APP: ', app);

    ws.app = app[app.length - 1];

    ws.on('message', (data) => {
        let jsond;
        try {
            jsond = JSON.parse(data);
        } catch (e) {
            console.error(e.message);
            return;
        }

        console.log('Got message', jsond);

        wss.clients.forEach((client) => {
            if (jsond.app === client.app) {
                console.log('Broadcasting on app: %s', client.app);
                client.send(data);
            }
        });
    });
}

wss.on('connection', onConnection);
wss.on('listening', function() {
    console.log(`HyperProxy Hub running on ${port}`);
});
