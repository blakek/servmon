var fs = require('fs'),
	express = require('express'),
	moment = require('moment'),
	bodyParser = require('body-parser'),
	app = express(),
	server = require('http').Server(app),
	os = require('os'),
	io = require('socket.io')(server),
	term = require('term.js'),
	port = process.env.PORT || 4454,
	public_folder = __dirname + '/public',
	basic_settings = {};

app.set('views', public_folder + '/views');

app.use(bodyParser.raw());
app.use(express.static(public_folder));
app.use(term.middleware());

basic_settings.hostname =  os.hostname();

io.on('connection', function (socket) {
	socket.on('tick', function () {
		io.emit('tock', moment().format('h:mm:ss a'));
	});

	socket.on('disconnect', function () {
		io.sockets.emit('user disconnected');
	});
});

app.get('/dash', function(req, res) {
	res.render('dash.jade', basic_settings);
});

app.get('/settings', function(req, res) {
	res.render('settings.jade');
});

app.get('/term', function(req, res) {
	res.render('term.jade', {title: 'Term'});
});

app.get('/editor/:loc?', function(req, res) {
	var file = {};

	if (req.params.loc !== undefined) {
		file.location = '/' + req.params.loc;
		file.contents = fs.readFileSync(file.location, {encoding: 'UTF-8'});
	}

	res.render('editor/editor.jade', file);
});

app.post('/editor/:loc', function(req, res) {
	console.log(req.body);
});

app.get('/', function(req, res) {
	res.render('dash.jade', basic_settings);
});

app.use('/', function(req, res) {
	console.error('ERROR: ' + req.url);
	res.render('404.jade');
});

server.listen(port, function () {
	console.log('Started at: http://' + os.hostname() + ':' + port);
});
