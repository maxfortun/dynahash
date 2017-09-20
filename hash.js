#!/usr/bin/env node 

if(process.argv.length < 4) {
	console.log("Usage: "+process.argv[0]+" <file> <bits> [bufferSize=1024]");
	process.exit();
}

var fs = require("fs");

const fileName = process.argv[2];
const bits = process.argv[3];
const bufferSize = (process.argv.length > 4 && null != process.argv[4]?process.argv[4]:1024);

if(!fs.existsSync(fileName)) {
	console.log(fileName+" does not exist");
	process.exit();
}

console.log("Compressing "+fileName+" into "+bits+" bits with "+bufferSize+" byte buffer");

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

		processData(buffer, bytesRead);

		if(eof) {
			fs.close(fd, showHash);
		}
	});
});

function processData(buffer, bytesRead) {
	console.log(bytesRead+": "+buffer);
}

function showHash() {
	console.log("Hash: ");
}

