var exec = require('child_process').exec;

exec('sutest.sh --list', function(error, stdout, stderr) {
	// var r = / {4}\* (.*)/g;
	var r = /    \* ([\s\S]*?)(?=    \* |$)/g
	//console.log(stdout.split('*'));

	// stdout.replace(/ {4}\* (.*)/g, function($1, $2) {
	// 	console.log($2);
	// });

	stdout.replace(r, function(string, match) {
		console.log(match);
	});

	//console.log(stdout.split(r).slice(1));
});