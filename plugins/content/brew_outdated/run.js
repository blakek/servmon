'use strict';

var exec = require('child_process').exec;

module.exports = function (ret) {
	exec('brew outdated', function(error, stdout, stderr) {
		var packages = stdout.split('\n');

		if (packages[packages.length - 1] == '') {
			packages.pop();
		}

		ret(packages);
	});
}