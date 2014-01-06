var AudioFile = new function() {
	this.name = new Array();
	this.data = new Array();
	this.counter = 0;
	
	this.load = function(_audioSrc, _audioName) {
		if(!this.getAudioDataByName(_audioName)) {
			var _audio = new Audio();
			_audio.src = _audioSrc;
			_audio.addEventListener('loadeddata', function(){Game.audioFile.counter++;});
			Game.audioFile.name.push(_audioName);
			Game.audioFile.data.push(_audio);
		}
	};
	
	this.isLoaded = function() {
		if(Game.audioFile.counter === Game.audioFile.data.length) {
			return true;
		}
		return false;
	};

	this.getAudioDataByName = function(_audioName) {
		return Game.audioFile.data[Game.audioFile.name.indexOf(_audioName)];
	};
	
};