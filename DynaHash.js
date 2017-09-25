var pi = require('./pi');

function DynaHash(bytes) {
	this.hash = new Array(parseInt(bytes)); 

	for(var i = 0, j = 0; i < this.hash.length; i++, j++) {
		for(;isNaN(pi[j]) && j < pi.length; j++);
		this.hash[i] = parseInt(pi[j]);
	}
}

DynaHash.prototype.processBuffer = function(buffer, bytesRead, final) {
	var i = 0;
	for(i = 0; i < bytesRead; i++) {
		this.processByte(i, buffer[i]);
	}
	if(!final) {
		return;
	}
	for(i = 0; i < this.hash.length; i++) {
		this.processByte(i, this.hash[this.getHashPosition(i-1)]);
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
	var xorHashPosition = this.getHashPosition(byte);

	this.hash[hashPosition] = this.hash[xorHashPosition] ^ byte;
	//console.log(position+"->"+hashPosition+": "+byte);
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

