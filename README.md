# omxplayer-webapi
Simple Web API for the Raspberry Pi omxplayer. Node.js server + example client.

## Requirements
express, node-omxplayer, node-json-rpc

## Usage

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
