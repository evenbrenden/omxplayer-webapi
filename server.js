'use strict';

let express = require('express');
let omx = require('node-omxplayer');
let fs = require('fs');
let os = require('os');
let rpc = require('node-json-rpc');
let msg = require('./helpers.js');

// URL API

let urlServer = express();

urlServer.get('/start/:file', function (req, res) {

    if (start(req.params.file)) {
        res.status(200).send({ 'result': msg.play(req.params.file) });
    } else {
        res.status(400).send({ 'result': msg.noFile(req.params.file) });
    }
});

urlServer.get('/stop', function (req, res) {

    stop();
    res.status(200).send({ 'result': msg.stop() });
});

urlServer.get('/list', function (req, res) {

    let files = fs.readdirSync(folder);
    console.log(msg.list(files));
    res.status(200).send({ 'result': files });
});

urlServer.get('/', function (req, res) {

    res.sendFile('index.html', { root: __dirname });
});

urlServer.get('*', function (req, res) {

    res.status(404).send('Unrecognized API call');
});

urlServer.use(function (err, req, res, next) {

    if (req.xhr) {
        res.status(500).send('Something went wrong');
    } else {
        next(err);
    }
});

let urlPort = 3000;
urlServer.listen(urlPort);
console.log('URL server listening on port ' + urlPort);

// JSON-RPC API

let rpcOptions = {
    port: 4000,
    host: '127.0.0.1',
    path: '/',
    strict: false
};

let rpcServer = new rpc.Server(rpcOptions);

rpcServer.addMethod('start', function (params, callback) {

    let error, result;

    if ('file' in params) {
        if (start(params.file)) {
            result = msg.play(params.file);
        } else {
            result = msg.noFile(params.file);
        }
    } else {
        error = { code: -32602, message: 'Invalid params' };
    }

    callback(error, result);
});

rpcServer.addMethod('stop', function (params, callback) {

    let error, result;
    stop();
    result = msg.stop();
    callback(error, result);
});

rpcServer.addMethod('list', function (params, callback) {

    let error, result;
    let files = fs.readdirSync(folder);
    console.log(msg.list(files));
    result = files;
    callback(error, result);
});

rpcServer.start(function (error) {
    if (error) throw error;
    else console.log('JSON-RPC server listening on port ' + rpcOptions.port);
});

// omxplayer control

let output = 'hdmi';
let loop = true;
let player;
let playing= false;
let folder = os.homedir() + '/Videos/';

function start(file) {

    let path = folder + file;
    if (!fs.existsSync(path)) {
        console.log(msg.noFile(file));
        return false;
    }

    if (playing) {
        player.quit();
    }

    player = omx(path, output, loop);
    playing = true;

    console.log(msg.play(file));
    return true;
}

function stop() {

    if (!playing) {
        return;
    }

    player.quit();
    playing = false;

    console.log(msg.stop());
}
