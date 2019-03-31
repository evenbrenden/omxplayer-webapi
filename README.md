# omxplayer-webapi
Web API for the Raspberry Pi omxplayer. Node.js URL and JSON-RPC servers and an example browser client.

## API

### URL

```
/start/[file]
/stop
/list
```

### JSON-RPC

```
{ "jsonrpc": "2.0", "method": "play", "params": { "file": [file] } }
{ "jsonrpc": "2.0", "method": "stop" }
{ "jsonrpc": "2.0", "method": "list" }
```

## Usage

```
node [url|rpc]server.js
```

## Requirements
express, node-json-rpc, node-omxplayer
