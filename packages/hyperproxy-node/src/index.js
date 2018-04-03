import Dat from 'dat-node';

// 1. Tell Dat where to download the files
Dat('./tmp/storage', {
    // 2. Tell Dat what link I want
    // (a 64 character hash from above)
    key: '40a7f6b6147ae695bcbcff432f684c7bb5291ea339c28c1755896cdeb80bd2f9/',
    temp: true,
    sparse: true
}, function(err, dat) {
    if (err) {
        throw err;
    }
    // 3. Join the network & download (files are automatically downloaded)
    dat.joinNetwork();

    dat.archive.readFile('/index.html', function(err, content) {
        // console.log(content.toString('utf8'));
    });
});
