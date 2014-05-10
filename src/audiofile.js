Molecule.module('Molecule.AudioFile', function (require, p) {

    var MAudio = require('Molecule.MAudio');

    function AudioFile(_game) {
        this.game = _game;
        this.name = [];
        this.data = [];
        this.counter = 0;
    }

    AudioFile.prototype.load = function(_id, _audioSrc) {
        if(!this.getAudioDataByName(_audioSrc)) {
            var self = this;
            var _audio = new Audio();
            var _audioSrcFile;
            var t = _audioSrc.split('.');
            if(_audio.canPlayType('audio/' + t[t.length - 1]) != '') {
                _audioSrcFile = _audioSrc;
            }
            _audio.addEventListener('canplay', function(){self.counter++});
            _audio.src = _audioSrcFile;
            this.name.push(_audioSrc);
            this.data.push(_audio);
        }

        var s = new MAudio();
        s.id = _id;
        s.sound = this.getAudioDataByName(_audioSrc);
        this.game.sounds[_id] = s;

        return s;
    };

    AudioFile.prototype.isLoaded = function() {
        return (this.counter === this.data.length);
    };

    AudioFile.prototype.getAudioDataByName = function(_audioName) {
        return this.data[this.name.indexOf(_audioName)];
    };

    return AudioFile;

});