function Sound(_name) {
	this.name = _name;
	this.sound = null;
	
	//Game.sound.push(this);
	
	return this;
};

Sound.prototype.add = function(_game) {
	this.sound = _game.audioFile.getAudioDataByName(this.name);
	_game.sound.push(this);
};

Sound.prototype.play = function(_loop) {
	if(this.sound.currentTime === this.sound.duration) {
		this.stop();
	}
	if(_loop === undefined) {
		_loop = false;
	}
	this.sound.loop = _loop;
	this.sound.play();
};

Sound.prototype.pause = function() {
	this.sound.pause();
};

Sound.prototype.stop = function() {
	this.sound.pause();
	this.sound.currentTime = 0;
};