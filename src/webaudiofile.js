Molecule.module('Molecule.WebAudioFile', function (require, p) {

    var MWebAudio = require('Molecule.MWebAudio');

    function WebAudioFile(_game) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.game = _game;
        this.name = [];
        this.data = [];
        this.id = [];
        this.counter = 0;
    }

    WebAudioFile.prototype.load = function(_id, _audioSrc) {
        var self = this;
        var ajaxReq = new XMLHttpRequest();
        var s = new MWebAudio();
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

    WebAudioFile.prototype.isLoaded = function() {
        return (this.counter === this.data.length);
    };

    WebAudioFile.prototype.getAudioDataByName = function(_audioName) {
        return this.data[this.name.indexOf(_audioName)];
    };

    return WebAudioFile;

});