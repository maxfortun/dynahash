function DynaHash(bytes) {
	this.hash = new Array(bytes); 
}

DynaHash.prototype.processData = function(buffer, bytesRead) {
	console.log(bytesRead+": "+buffer);
}

DynaHash.prototype.toString = function() {
	return "Hash: ";
}

module.exports = DynaHash;

