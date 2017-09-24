#!/usr/bin/env node 

if(process.argv.length < 4) {
	console.log("Usage: "+process.argv[0]+" bytes=64 bufferSize=1024 file1 .. fileN");
	process.exit();
}

var fs = require("fs");

const args = processArgv(process.argv);

for(var i = 0; i < args.args.length; i++) {
	var file = args.args[i];
	processFile(file, args.options.bytes, args.options.bufferSize);
}

function processArgv(argv) {
	var args =	{
					options: {
						bytes: 64,
						bufferSize: 1024
					},
					args: []
				};

	for(var i = 2; i < argv.length; i++) {
		var arg = argv[i].split('=');
		if(arg.length > 1) {
			args.options[arg[0]]=arg[1];
		} else {
			args.args.push(arg[0]);
		}
	}

	console.log(args);
	return args;
}

function processFile(fileName, bytes, bufferSize) {
	if(!fs.existsSync(fileName)) {
		console.log(fileName+" does not exist");
		return;
	}

	console.log("Compressing "+fileName+" into "+bytes+" bytes with "+bufferSize+" byte buffer");

	var DynaHash = require("./DynaHash");
	dynaHash = new DynaHash(bytes);

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
	
			dynaHash.processData(buffer, bytesRead);
	
			if(eof) {
				fs.close(fd, () => { showHash(dynaHash); });
			}
		});
	});
}


function showHash(dynaHash) {
	console.log(dynaHash.toString());
}

