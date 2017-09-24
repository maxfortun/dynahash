function Args(argv, offset, optionDefaults) {
	this.options = optionDefaults;
	if(!this.options) {
		this.options = {};
	}

	this.args = [];

	for(var i = offset; i < argv.length; i++) {
		var arg = argv[i].split('=');
		if(arg.length > 1) {
			this.options[arg[0]]=arg[1];
		} else {
			this.args.push(arg[0]);
		}
	}

	console.log(this);
	return this;
}

module.exports = Args;


