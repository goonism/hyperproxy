import Dat from 'dat-node';

// 1. Tell Dat where to download the files
Dat('/tmp/storage', {
  // 2. Tell Dat what link I want
  key: '<dat-key>' // (a 64 character hash from above)
}, function (err, dat) {
  if (err) throw err;

  // 3. Join the network & download (files are automatically downloaded)
  dat.joinNetwork();
});
