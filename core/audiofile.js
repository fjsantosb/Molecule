function AudioFile() {
	this.name = new Array();
	this.data = new Array();
	this.counter = 0;
};

AudioFile.prototype.load = function(_audioSrc, _audioName) {
	if(!this.getAudioDataByName(_audioName)) {
		var self = this;
		var _audioSrcFile;
		var _audio = new Audio();
		for(var i = 0; i < _audioSrc.length; i++) {
			var t = _audioSrc[i].split('.');
			if(_audio.canPlayType('audio/' + t[t.length - 1]) != '') {
				_audioSrcFile = _audioSrc[i];
			}
		}
		_audio.src = _audioSrcFile;
		_audio.addEventListener('canplay', function(){self.counter++;});
		this.name.push(_audioName);
		this.data.push(_audio);
	}
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