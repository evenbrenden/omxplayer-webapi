'use strict';

let express = require('express');
let omx = require('node-omxplayer');
let fs = require('fs');
let os = require('os');

let app = express();

let output = 'hdmi';
let loop = true;
let player;
let playing= false;
let folder = os.homedir() + '/Videos/';

app.get('/start/:file', function (req, res) {

    let path = folder + req.params.file;
    if (!fs.existsSync(path)) {
        let message = req.params.file + ' does not exist!';
        console.log(message);
        res.status(400).send(message);
        return;
    }

    if (playing) {
        player.quit();
    }

    player = omx(path, output, loop);
    playing = true;

    let message = 'Playing ' + req.params.file;
    console.log(message);
    res.status(200).send({"status": message});
});

app.get('/stop', function (req, res) {
    if (!playing) {
        return;
    }

    player.quit();
    playing = false;

    let message = 'Stopped playback';
    console.log(message);
    res.status(200).send({"status": message});
});

app.get('/list', function (req, res) {

    let files = fs.readdirSync(folder);
    console.log(files);
    res.status(200).send({"videos": files});
});

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname });
});

app.get('*', function (req, res) {
    res.status(404).send('Unrecognised API call');
});

app.use(function (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send('Oops, Something went wrong!');
    } else {
        next(err);
    }
});

app.listen(3000);
console.log('Listening on port 3000');
