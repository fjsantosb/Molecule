Molecule.module('Molecule.MAudio', function (require, p) {

	function MAudio() {
		this.sound = null;
	}

    MAudio.prototype.play = function(_loop) {
		_loop = typeof _loop === 'undefined' ? false : _loop;
		if(this.sound.currentTime === this.sound.duration) {
			this.stop();
		}
		this.sound.loop = _loop;
        if (!this.sound.paused) {
            this.stop();
        }
        this.sound.play();
	};

    MAudio.prototype.pause = function() {
		this.sound.pause();
	};

    MAudio.prototype.stop = function() {
		this.sound.pause();
		this.sound.currentTime = 0;
	};

    MAudio.prototype.clone = function () {

        var mAudio = new MAudio();
        mAudio.sound = new Audio();
        mAudio.sound.src = this.sound.src;
        return mAudio;

    };

	return MAudio;

});