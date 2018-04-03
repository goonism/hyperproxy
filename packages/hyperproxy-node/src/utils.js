async function readStream(stream) {
    return new Promise(function(resolve, reject) {
        let data = '';

        stream.on('data', dPiece => data += dPiece);

        stream.on('end', () => {
            resolve(data);
        });
    });
}
