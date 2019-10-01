const follow = require('follow');
const fs = require('fs');

const seqfile = './.seq';

fs.readFile(seqfile, 'utf8', (err, since) => {
  if (err) {
    console.error("couldn't read .seq file,", err);
  }
  since = process.argv[2] || (since || '').trim() || 'now';
  console.error('resuming from %s', since);
  read(since);
});


function read(fd, since) {
  const feed = new follow.Feed({});

  // You can also set values directly.
  feed.db = 'https://skimdb.npmjs.com/registry';
  feed.since = since || 'now';
  feed.include_docs = true;
  feed.heartbeat = 30 * 1000;
  feed.inactivity_ms = 86400 * 1000;

  feed.on('change', (change) => {
    const doc = change.doc;
    console.log('%s@%s', doc.name, doc['dist-tags'].latest);
    if (change.seq) {
      fs.writeFileSync(seqfile, change.seq); // update our pointer
    }
  });

  feed.on('error', function(er) {
    console.error('follow had a fatal error');
    console.error(e.stack);
    throw er;
  });

  feed.follow();
}
