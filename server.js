'use strict';

const omx = require('./omxcontrol.js');
const http = require('http');
const fs = require('fs');
const ws = new require('ws');

const wss = new ws.Server({ noServer: true });

function handleRPC(res, rpc) {

    if (!rpc.hasOwnProperty('method')) {
        respond({ error: { code: -32601, message: 'Missing method' } }, rpc.id, res);
        return;
    }

    switch (rpc.method) {
        case 'start':
            if (!rpc.hasOwnProperty('params') || !rpc.params.hasOwnProperty('file')) {
                respond({ error: { code: -32602, message: 'Missing or invalid parameter' } }, rpc.id, res);
                return;
            }
            let file = rpc.params.file;
            if (omx.start(file)) {
                respond({ 'result': 'Playing ' + file }, rpc.id, res);
            } else {
                respond({ error: { code: -32000, message: file + ' does not exist!' } }, rpc.id, res);
            }
            break;
        case 'stop':
            omx.stop();
            respond({ 'result': 'Stopped playback'}, rpc.id, res);
            break;
        case 'list':
            let files = omx.files();
            respond({ 'result': files }, rpc.id, res);
            break;
        default:
            respond({ error: { code: -32601, message: 'Invalid method' } }, rpc.id, res);
    }
}

function respond(message, id, res) {

    if (message.hasOwnProperty('error')) {
        if (id) {
            message['id'] = id;
        } else {
            message['id'] = null;
        }
    } else {
        if (id) {
            message['id'] = id;
        }
    }
    let reply = JSON.stringify(message);
    console.log('< ' + reply);
    res.send(reply);
}

function accept(req, res) {

    if (req.url == '/ws' &&
        req.headers.upgrade &&
        req.headers.upgrade.toLowerCase() == 'websocket' &&
        req.headers.connection.match(/\bupgrade\b/i))
    {
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
    } else if (req.url == '/') {
        fs.createReadStream('./client.html').pipe(res);
    } else {
        res.writeHead(404);
        res.end();
    }
}

function onSocketConnect(ws) {

    console.log(`New connection`);

    ws.on('message', function(message) {

        console.log('> ' + message);
        let rpc = JSON.parse(message);
        handleRPC(ws, rpc);
    });

    ws.on('close', function() {

        console.log(`Connection closed`);
    });
}

let port = 8080;
console.log('Listening on ' + port);
http.createServer(accept).listen(port);
