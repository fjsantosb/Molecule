Molecule.module('Molecule.MWebAudio', function (require, p) {

    function MWebAudio() {
        this.sound = null;
        this.buffer = null;
        this.context = null;
        this.startOffset = 0;
        this.startTime = 0;
    }

    MWebAudio.prototype.play = function(_loop) {
        _loop = typeof _loop === 'undefined' ? false : _loop;
        this.startTime = this.context.currentTime;
        if(this.sound && this.sound.playbackState === 2) {
            this.sound.stop(0);
        }
        this.sound = this.context.createBufferSource();
        this.sound.connect(this.context.destination);
        this.sound.buffer = this.buffer;
        this.sound.loop = _loop;
        this.sound.start(0, this.startOffset % this.buffer.duration);
    };
    
    MWebAudio.prototype.pause = function() {
        if(this.sound && this.sound.playbackState !== 3) {
            this.sound.stop(0);
            this.startOffset += this.context.currentTime - this.startTime;
        }
    };

    MWebAudio.prototype.stop = function() {
        if(this.sound && this.sound.playbackState !== 3) {
            this.sound.stop(0);
            this.startOffset = 0;
        }
    };

    MWebAudio.prototype.clone = function () {
        var mWebAudio = new MWebAudio();
        mWebAudio.context = this.context;
        mWebAudio.sound = this.sound;
        mWebAudio.buffer = this.buffer;
        return mWebAudio;
    };

    return MWebAudio;

});