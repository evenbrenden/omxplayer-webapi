'use strict';

let rpc = require('node-json-rpc');
let msg = require('./helpers.js');
let omx = require('./omxcontrol.js');

let options = {

    port: 3000,
    host: '127.0.0.1',
    path: '/',
    strict: false
};

let server = new rpc.Server(options);

server.addMethod('start', function (params, callback) {

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

server.addMethod('stop', function (params, callback) {

    let error, result;
    omx.stop();
    result = msg.stop();
    console.log(result);
    callback(error, result);
});

server.addMethod('list', function (params, callback) {

    let error, result;
    let files = omx.files();
    result = files;
    console.log(msg.list(result));
    callback(error, result);
});

server.start(function (error) {

    if (error) throw error;
    else console.log('JSON-RPC server listening on port ' + options.port);
});
