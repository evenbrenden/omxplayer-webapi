# omxplayer-webapi
JSON-RPC API for the Raspberry Pi omxplayer. Node.js server with example browser client.

## Usage

Run `node server.js` and visit your Raspberry Pi on port 3000.

## API

```
{ "jsonrpc": "2.0", "method": "play", "params": { "file": [file] } }
{ "jsonrpc": "2.0", "method": "stop" }
{ "jsonrpc": "2.0", "method": "list" }
```

## Requirements
express, node-omxplayer
