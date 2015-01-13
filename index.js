var fs = require('fs'),
	express = require('express'),
	moment = require('moment'),
	bodyParser = require('body-parser'),
	mkdirp = require('mkdirp'),
	path = require('path'),
	app = express(),
	server = require('http').Server(app),
	os = require('os'),
	io = require('socket.io')(server),
	term = require('term.js'),
	port = process.env.PORT || 4454,
	public_folder = __dirname + '/public',
	basic_settings = {};

app.set('views', public_folder + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
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

app.get(['/editor', '/editor/*'], function(req, res) {
	var file = {},
	    fstats;

	if (req.params[0] !== undefined) {
		try {
			file.location = '/' + req.params[0];
			fstats = fs.statSync(file.location);

			if (fstats.isFile()) {
				file.contents = fs.readFileSync(file.location, {encoding: 'UTF-8'});
			} else if (fstats.isDirectory()) {
				// TODO: make it so that a file chooser is shown at the given directory.
				console.info(file.location + ' is a directory.');
			}
		} catch (e) {
			// TODO: show user that there is no such file or directory
			console.warn('No such file or directory: ' + file.location);
		}
	}

	res.render('editor/editor.jade', file);
});

app.post('/editor/*', function(req, res) {
	var loc = req.params[0];
	mkdirp(path.dirname(loc), function (err) { // This may be undesired behavior??
		if (err) console.error(err);
		fs.writeFile(loc, req.body.contents, { encoding: 'utf8' }, function (err) {
			if (err) console.error(err);
			else console.log('Saved file: ' + loc);
		});
	});
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
