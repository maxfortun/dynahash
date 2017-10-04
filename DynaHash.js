var pi = require('./pi');

function DynaHash(bits) {
	this.bits = bits;
	this.bytes = Math.ceil(bits / 8);

	//console.log("Bytes", this.bytes);
	this.hash = new Array(parseInt(this.bytes)); 

	for(var i = 0; i < this.hash.length; i++) {
		this.hash[i] = 0;
	}
/*
	for(var i = 0, j = 0; i < this.hash.length; i++, j++) {
		for(;isNaN(pi[j]) && j < pi.length; j++);
		this.hash[i] = parseInt(pi[j]);
	}
*/

}

DynaHash.prototype.processBuffer = function(buffer, bytesRead, final) {
	var i = 0;
	for(; i < bytesRead; i++) {
		this.processByte(i, buffer[i]);
	}
	if(!final) {
		return;
	}
/*
	for(i = 0; i < this.hash.length; i++) {
		this.processByte(i, this.hash[this.getHashPosition(i-1)]);
	}
*/
}

DynaHash.prototype.getHashPosition = function(position) {
	if(position < 0) {
		position = this.hash.length - position;
	}
	return position % this.hash.length;
}


DynaHash.prototype.rotLeft = function(byte, count) {
	count %= 8;
	if(count == 0 || count == 8) {
		return byte;
	}
	var high = (byte << count) & 0xFF;
	var low = ((byte << count) & 0xFF00) >>> 8;
	var rot = high | low ;
	//console.log("rotLeft",count,byte.toString(2), low.toString(2), high.toString(2), rot.toString(2));
	return rot;
}

DynaHash.prototype.rotRight = function(byte, count) {
	count %= 8;
	if(count == 0 || count == 8) {
		return byte;
	}
	var low = (byte >> count) & 0xFF;
	var high = (byte & (0xFF>>(8-count))) << 8-count;
	var rot = high | low;
	//console.log("rotRight",count,byte.toString(2), low.toString(2), high.toString(2), rot.toString(2));
	return rot;
}

DynaHash.prototype.getPIDigit = function(position) {
		for(;isNaN(pi[position]) && position < pi.length; position++);
		return parseInt(pi[position]);
}

DynaHash.prototype.processByte = function(position, byte) {
	//console.log(byte.toString(2));
	var stretched = new Array(this.bytes);
	for(var i = 0; i < stretched.length; i++) {
		stretched[i] = 0;
	}

	for(var i = 0; i < this.bits; i++) {
		var bitOffset = Math.floor(i / this.bytes);
		var bit=(byte>>>bitOffset)&0x1;
		var byteOffset = Math.floor(i / 8);
		var shifted = bit<<bitOffset;
		
		stretched[byteOffset] |= shifted;
		//console.log(i, bitOffset, bit, byteOffset, shifted, stretched[byteOffset], this.toString(stretched));
	}

	for(var i = 0; i < stretched.length; i++) {
		if(this.hash[i] > stretched[i]) {
			this.hash[i] = this.rotRight(this.hash[i], this.getPIDigit(this.hash[i]));
		} else {
			this.hash[i] = this.rotLeft(this.hash[i], this.getPIDigit(this.hash[i]));
		}
		this.hash[i] ^= stretched[i];
	}
/*
	stretch one byte to hash length
	xor a stretched byte with hash
	rotate by the number of bits in pi digit corresponding to original byte
*/

/*
	var hashPosition = this.getHashPosition(position);
	var xorHashPosition = this.getHashPosition(byte);
	this.hash[hashPosition] = this.hash[xorHashPosition] ^ byte;
*/
	//console.log(position+"->"+hashPosition+": "+byte);
}

DynaHash.prototype.toString = function(array) {
	if(!array) {
		array = this.hash;
	}
	var hashString = "";
	for(var i = 0; i < array.length; i++) {
		var byte = array[i].toString(16);
		if(byte.length < 2) {
			hashString+="0";
		}
		hashString+=byte;
	}
	return hashString;
}

module.exports = DynaHash;

