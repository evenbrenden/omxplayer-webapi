'use strict';

module.exports = {

play: function playingMessage(file) {
    return 'Playing ' + file;
},

stop: function stoppedMessage() {
    return 'Stopped playback';
},

noFile : function noFileMessage(file) {
    return file + ' does not exist!';
},

list : function listMessage(files) {
    return 'Available files: ' + files;
}

}
