Molecule.module('Molecule.AudioFile', function (require, p) {

    var MAudio = require('Molecule.MAudio');

    function AudioFile(_game) {
        this.game = _game;
        this.name = [];
        this.data = [];
        this.id = [];
        this.counter = 0;
    }

    AudioFile.prototype.load = function(_id, _audioSrc) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var self = this;
        var context = new AudioContext();
        var ajaxReq = new XMLHttpRequest();
        var s = new MAudio();
        s.id = _id;
        s.sound = context.createBufferSource();
        s.sound.connect(context.destination);
        
        if(!this.getAudioDataByName(_audioSrc)) {
            
            ajaxReq.open('GET', _audioSrc, true);
            ajaxReq.responseType = 'arraybuffer';
            ajaxReq.onload = function () {
                context.decodeAudioData(ajaxReq.response, function (buffer) {
                    self.name.push(_audioSrc);
                    self.id.push(_id);
                    self.data.push(buffer);
                    self.game.sounds[_id].buffer = buffer;
                });
            }
            ajaxReq.send();
            this.counter++;
        }

        if(this.isLoaded())
            s.buffer = this.getAudioDataByName(_audioSrc);
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