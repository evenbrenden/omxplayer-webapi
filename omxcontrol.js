'use strict';

let omx = require('node-omxplayer');
let fs = require('fs');
let os = require('os');

let output = 'hdmi';
let loop = true;
let player;
let playing= false;
let folder = os.homedir() + '/Videos/';

module.exports = {

    start: function start(file) {

        let path = folder + file;
        if (!fs.existsSync(path)) {
            return false;
        }

        if (playing) {
            player.quit();
        }

        player = omx(path, output, loop);
        playing = true;

        return true;
    },

    stop: function stop() {

        if (!playing) {
            return;
        }

        player.quit();
        playing = false;
    },

    files: function videos() {

        return fs.readdirSync(folder);
    }

};
