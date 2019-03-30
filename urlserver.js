'use strict';

let express = require('express');
let msg = require('./helpers.js');
let omx = require('./omxcontrol.js');

let server = express();

server.get('/start/:file', function (req, res) {

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

server.get('/stop', function (req, res) {

    omx.stop();
    let result = msg.stop();
    console.log(result);
    res.status(200).send({ 'result': result });
});

server.get('/list', function (req, res) {

    let files = omx.files();
    console.log(msg.list(files));
    res.status(200).send({ 'result': files });
});

server.get('/', function (req, res) {

    res.sendFile('index.html', { root: __dirname });
});

server.get('*', function (req, res) {

    res.status(404).send('Unrecognized API call');
});

server.use(function (err, req, res, next) {

    if (req.xhr) {
        res.status(500).send('Something went wrong');
    } else {
        next(err);
    }
});

let port = 3000;
server.listen(port);
console.log('URL server listening on port ' + port);
