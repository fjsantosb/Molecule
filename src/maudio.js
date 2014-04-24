Molecule.module('Molecule.MAudio', function (require, p) {

    function MAudio() {
        this.sound = null;
        this.buffer = null;
    }

    MAudio.prototype.play = function(_loop) {
        _loop = typeof _loop === 'undefined' ? false : _loop;
        this.sound.buffer = this.buffer;
        this.sound.loop = _loop;
        this.sound.start(0);
    };

    MAudio.prototype.stop = function() {
        this.sound.stop(0);
    };

    MAudio.prototype.clone = function () {

        var mAudio = new MAudio();
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();
        mAudio.sound = this.sound;
        mAudio.buffer = this.buffer;
        return mAudio;

    };

    return MAudio;

});