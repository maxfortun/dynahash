#!/usr/bin/env node 

if(process.argv.length < 3) {
	console.log("Usage: "+process.argv[0]+" bits=512 bufferSize=1024 file1 .. fileN");
	process.exit();
}

var fs = require("fs");
var readline = require('readline');
var DynaHash = require("./DynaHash");
var Args = require('./Args');

var args = new Args(process.argv, 2, {
										bits: 512,
										bufferSize: 1024
									});

for(var i = 0; i < args.args.length; i++) {
	var file = args.args[i];
	processFile(file, args.options.bits, args.options.bufferSize);
}

function processFile(fileName, bits, bufferSize) {
	if(!fs.existsSync(fileName)) {
		console.log(fileName+" does not exist");
		return;
	}

	console.log("Compressing "+fileName+" into "+bits+" bits with "+bufferSize+" byte buffer");


	var lineReader = readline.createInterface({
		input: fs.createReadStream(fileName)
	});

	lineReader.on('line', function (line) {
		var dynaHash = new DynaHash(bits);
		dynaHash.processBuffer(new Buffer(line), line.length, true);
		console.log(dynaHash.toString()+" "+fileName+": "+line);
	});
}

