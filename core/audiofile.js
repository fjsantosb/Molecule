var AudioFile = new function() {
	this.name = new Array();
	this.data = new Array();
	this.counter = 0;
	
	this.load = function(_audioSrc, _audioName) {
		if(!this.getAudioDataByName(_audioName)) {
			var _audioSrcFile;
			var _audio = new Audio();
			for(var i = 0; i < _audioSrc.length; i++) {
				var t = _audioSrc[i].split('.');
				console.log(_audio.canPlayType('audio/' + (t[t.length - 1])));
				if(_audio.canPlayType('audio/' + t[t.length - 1]) != '') {
					_audioSrcFile = _audioSrc[i];
				}
			}
			_audio.src = _audioSrcFile;
			_audio.addEventListener('canplaythrough', function(){Game.audioFile.counter++;});
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