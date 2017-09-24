var pi = require('./pi');

function DynaHash(bytes) {
	this.hash = new Array(parseInt(bytes)); 

	for(var i = 0, j = 0; i < this.hash.length; i++, j++) {
		for(;isNaN(pi[j]) && j < pi.length; j++);
		this.hash[i] = parseInt(pi[j]);
	}
}

DynaHash.prototype.processBuffer = function(buffer, bytesRead) {
	for(var i = 0; i < bytesRead; i++) {
		this.processByte(i, buffer[i]);
	}
}

DynaHash.prototype.getHashPosition = function(position) {
	if(position < 0) {
		position = this.hash.length - position;
	}
	return position % this.hash.length;
}

DynaHash.prototype.processByte = function(position, byte) {
	var hashPosition = this.getHashPosition(position);
	this.hash[hashPosition] = this.hash[hashPosition] ^ byte;
	console.log(position+"->"+hashPosition+": "+byte);
}

DynaHash.prototype.toString = function() {
	var hashString = "";
	for(var i = 0; i < this.hash.length; i++) {
		var byte = this.hash[i].toString(16);
		if(byte.length < 2) {
			hashString+="0";
		}
		hashString+=byte;
	}
	return hashString;
}

module.exports = DynaHash;

