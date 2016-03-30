# snyk-follow-npm 💃

Simple CLI tool to echo out newly published packages on npm's registry.

It follows the skimdb/registry changes, and self-manages the current sequence id (through a local `.seq` file).

By default the follower starts from `now`, but you can pass a sequence id via the command line:

```bash
$ snyk-follow-npm 12345
```

The starting sequence point is echo'ed on `STDERR` so that only the package@version is streamed on `STDOUT`.

## Installation

```
npm i -g snyk-follow-npm
```

💃
