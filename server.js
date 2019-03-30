'use strict';

let express = require('express');
let rpc = require('node-json-rpc');
let msg = require('./helpers.js');
let omx = require('./omxcontrol.js');

// URL API

let urlServer = express();

urlServer.get('/start/:file', function (req, res) {

    if (omx.start(req.params.file)) {
        let result = msg.play(req.params.file)
        console.log(result);
        res.status(200).send({ 'result': result });
    } else {
        let result = msg.noFile(req.params.file)
        console.log(result);
        res.status(400).send({ 'result': result });
    }
});

urlServer.get('/stop', function (req, res) {

    omx.stop();
    let result = msg.stop();
    console.log(result);
    res.status(200).send({ 'result': result });
});

urlServer.get('/list', function (req, res) {

    let files = omx.files();
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

    if (params['file']) {
        if (omx.start(params.file)) {
            result = msg.play(params.file);
        } else {
            result = msg.noFile(params.file);
        }
    } else {
        error = { code: -32602, message: 'Invalid params' };
    }

    if (error) {
        console.log(error);
    } else {
        console.log(result);
    }
    callback(error, result);
});

rpcServer.addMethod('stop', function (params, callback) {

    let error, result;
    omx.stop();
    result = msg.stop();
    console.log(result);
    callback(error, result);
});

rpcServer.addMethod('list', function (params, callback) {

    let error, result;
    let files = omx.files();
    result = files;
    console.log(msg.list(result));
    callback(error, result);
});

rpcServer.start(function (error) {

    if (error) throw error;
    else console.log('JSON-RPC server listening on port ' + rpcOptions.port);
});
