var follow = require('follow');
var fs = require('fs');

var seqfile = './.seq';

var stream = fs.createWriteStream(seqfile, {
  flags: 'r+',
  defaultEncoding: 'utf8',
});

stream.on('open', (fd) => {
  fs.readFile(seqfile, 'utf8', (err, since) => {
    since = process.argv[2] || (since || '').trim() || 'now';
    if (since) {
      console.error('resuming from %s', since);
    }
    read(fd, since);
  });
});

function read(fd, since) {
  var feed = new follow.Feed({});

  // You can also set values directly.
  feed.db = 'https://skimdb.npmjs.com/registry';
  feed.since = since || 'now';
  feed.include_docs = true;
  feed.heartbeat = 30 * 1000;
  feed.inactivity_ms = 86400 * 1000;

  feed.on('change', (change) => {
    var doc = change.doc;
    var time = doc.time.modified;
    delete doc.time.modified;
    var updated = Object.keys(doc.time)
      .filter((k) => doc.time[k] === time)
      .shift();

    console.log('%s@%s', change.doc.name, updated);
    fs.write(fd, change.seq, 0, 'utf8'); // update our pointer
  });

  feed.on('error', function(er) {
    console.error('follow had a fatel error');
    console.error(e.stack);
    throw er;
  });

  feed.follow();
}
