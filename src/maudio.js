Molecule.module('Molecule.MAudio', function (require, p) {

    function MAudio() {
        this.sound = null;
        this.buffer = null;
        this.context = null;
        this.startOffset = 0;
        this.startTime = 0;
    }

    MAudio.prototype.play = function(_loop) {
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
    
    MAudio.prototype.pause = function() {
        if(this.sound && this.sound.playbackState !== 3) {
            this.sound.stop(0);
            this.startOffset += this.context.currentTime - this.startTime;
        }
    };

    MAudio.prototype.stop = function() {
        if(this.sound && this.sound.playbackState !== 3) {
            this.sound.stop(0);
            this.startOffset = 0;
        }
    };

    MAudio.prototype.clone = function () {

        var mAudio = new MAudio();
        mAudio.context = this.context;
        mAudio.sound = this.sound;
        mAudio.buffer = this.buffer;
        return mAudio;

    };

    return MAudio;

});