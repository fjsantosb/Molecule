Molecule.module('Molecule.AudioFile', function (require, p) {

    var MAudio = require('Molecule.MAudio');

    function AudioFile(_game) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.game = _game;
        this.name = [];
        this.data = [];
        this.id = [];
        this.counter = 0;
    }

    AudioFile.prototype.load = function(_id, _audioSrc) {
        var self = this;
        var ajaxReq = new XMLHttpRequest();
        var s = new MAudio();
        s.id = _id;
        s.context = this.context;
        
        if(!this.getAudioDataByName(_audioSrc)) {    
            ajaxReq.open('GET', _audioSrc, true);
            ajaxReq.responseType = 'arraybuffer';
            ajaxReq.onload = function () {
                s.context.decodeAudioData(ajaxReq.response, function (buffer) {
                    self.name.push(_audioSrc);
                    self.id.push(_id);
                    self.data.push(buffer);
                    self.game.sounds[_id].buffer = buffer;
                });
            }
            ajaxReq.send();
            this.counter++;
        } else {
            self.game.sounds[_id].buffer = this.getAudioDataByName(_audioSrc);
        }
        
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