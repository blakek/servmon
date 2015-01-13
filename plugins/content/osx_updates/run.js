'use strict';

/*
Example thing to run to simulate updates...

#!/bin/sh

echo 'Software Update Tool
Copyright 2002-2012 Apple Inc.

Finding available software
Software Update found the following new or updated software:
    * MacBookAirEFIUpdate2.4-2.4
	MacBook Air EFI Firmware Update (2.4), 3817K [recommended] [restart]
    * ProAppsQTCodecs-1.0
	ProApps QuickTime codecs (1.0), 968K [recommended]
    * JavaForOSX-1.0
	Java for OS X 2012-005 (1.0), 65288K [recommended]
'
*/

var exec = require('child_process').exec;

module.exports = function (ret) {
	exec('softwareupdate --list', function(error, stdout, stderr) {
		var packages = [];
		stdout.replace(/ {4}\* (.*)/g, function($1, $2) {
			packages.push($2);
		});

		ret(packages);
	});
}