#!/usr/bin/env node 

if(process.argv.length < 3) {
	console.log("Usage: "+process.argv[0]+" bytes=64 bufferSize=1024 file1 .. fileN");
	process.exit();
}

var fs = require("fs");
var DynaHash = require("./DynaHash");
var Args = require('./Args');

var args = new Args(process.argv, 2, {
										bytes: 64,
										bufferSize: 1024
									});

for(var i = 0; i < args.args.length; i++) {
	var file = args.args[i];
	processFile(file, args.options.bytes, args.options.bufferSize);
}

function processFile(fileName, bytes, bufferSize) {
	if(!fs.existsSync(fileName)) {
		console.log(fileName+" does not exist");
		return;
	}

	console.log("Compressing "+fileName+" into "+bytes+" bytes with "+bufferSize+" byte buffer");

	var dynaHash = new DynaHash(bytes);

	fs.open(fileName, 'r', (err, fd) => {
		if (err) {
			console.log("open: "+JSON.stringify(err));
			return;
		}

		var buffer = new Buffer(bufferSize);
		fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead, buffer) => {
			if (err) {
				console.log("read: "+JSON.stringify(err));
				return;
			}
			const eof = (bytesRead != buffer.length);
	
			dynaHash.processBuffer(buffer, bytesRead);
	
			if(eof) {
				fs.close(fd, () => { showHash(fileName, dynaHash); });
			}
		});
	});
}


function showHash(fileName, dynaHash) {
	console.log(fileName+": "+dynaHash.toString());
}

