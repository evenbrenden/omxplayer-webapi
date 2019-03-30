# omxplayer-webapi
Simple Web APIs for the Raspberry Pi omxplayer. Node.js URL and JSON-RPC servers and an example URL client.

## Requirements
express, node-json-rpc, node-omxplayer

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
