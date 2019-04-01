# omxplayer-webapi
WebSocket JSON-RPC API for the Raspberry Pi omxplayer. Node.js server and example browser client.

## Usage

Run `node server.js` and visit your Raspberry Pi on port 8080.

## API

```
{ "jsonrpc": "2.0", "method": "play", "params": { "file": [file] } }
{ "jsonrpc": "2.0", "method": "stop" }
{ "jsonrpc": "2.0", "method": "list" }
```

## Requirements
ws, node-omxplayer
