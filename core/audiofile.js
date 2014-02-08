function AudioFile(_game) {
	this.game = _game;
	this.name = new Array();
	this.data = new Array();
	this.counter = 0;
	
	return this;
};

AudioFile.prototype.load = function(_audioSrc) {
	if(!this.getAudioDataByName(_audioSrc)) {
		var self = this;
		var _audio = new Audio();
		var _audioSrcFile;
		for(var i = 0; i < _audioSrc.length; i++) {
			var t = _audioSrc[i].split('.');
			if(_audio.canPlayType('audio/' + t[t.length - 1]) != '') {
				_audioSrcFile = _audioSrc[i];
			}
		}
		_audio.addEventListener('canplay', function(){self.counter++});
		_audio.src = _audioSrcFile;
		this.name.push(_audioSrc);
		this.data.push(_audio);
	}
	
	var s = new Sound();
	s.sound = this.getAudioDataByName(_audioSrc);
	this.game.sound.push(s);
	
	return s;
};
	
AudioFile.prototype.isLoaded = function() {
	if(this.counter === this.data.length) {
		return true;
	}
	return false;
};

AudioFile.prototype.getAudioDataByName = function(_audioName) {
	return this.data[this.name.indexOf(_audioName)];
};