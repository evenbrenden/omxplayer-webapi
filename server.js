'use strict';

let express = require('express');
let omx = require('./omxcontrol.js');

let app = express();
app.use(express.json());

app.post('/', function (req, res) {

    let rpc = req.body;
    let response;

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
                respond({ code: -32000, message: file + ' does not exist!' }, rpc.id, res);
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
            respond({ code: -32601, message: 'Invalid method' }, rpc.id, res);
    }
});

function respond(message, id, res) {

    let code;
    if (message.hasOwnProperty('error')) {
        if (id) {
            message['id'] = id;
        } else {
            message['id'] = null;
        }
        code = 400;
    } else {
        if (id) {
            message['id'] = id;
            code = 200;
        } else {
            code = 204;
        }
    }
    console.log(message);
    res.status(code).send(message);
}

app.get('/', function (req, res) {

    res.sendFile('client.html', { root: __dirname });
});

app.get('*', function (req, res) {

    res.status(404).send('Unrecognized API call');
});

app.use(function (err, req, res, next) {

    if (req.xhr) {
        res.status(500).send('Something went wrong');
    } else {
        next(err);
    }
});

app.use(function (error, req, res, next) {

	if (error instanceof SyntaxError) {
		return res.status(500).send( { data : "Invalid data" } );
	} else {
		next();
	}
});

let port = 3000;
app.listen(port);
console.log('Listening on port ' + port);
