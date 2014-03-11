Molecule.module('Molecule.Animation', function (require, p) {

    function Animation() {
        this.frame = [];
        this.id = [];
        this.current = {animation: 0, frame: 0};
        this.timer = 0;
        this.loop = true;
        this.reverse = false;
        this.halt = false;
    };

    Animation.prototype.sliceFrames = function(_imageWidth, _imageHeight, _frameWidth, _frameHeight) {
        this.frame = [];
        this.id = [];
        for(var i = 0; i < _imageHeight - 1; i += _frameHeight) {
            for(var j = 0; j < _imageWidth - 1; j += _frameWidth) {
                this.frame.push({x:j, y:i});
            }
        }
        if(_imageWidth === _frameWidth && _imageHeight === _frameHeight) {
            this.add('', [0], 60);
        }
    };

    Animation.prototype.add = function(_name, _frames, _speed) {
        var _speedFps = _speed * 60 / _frames.length;
        this.id.push({name: _name, frame: _frames, speed: _speedFps});
    };

    Animation.prototype.run = function(_name, _loop, _reverse) {
        _loop = _loop === undefined ? true : _loop;
        _reverse = _reverse === undefined ? false : _reverse;
        this.loop = _loop;
        this.reverse = _reverse;
        this.halt = false;
        if(this.current.animation === -1 || this.id[this.current.animation].name !== _name) {
            this.current.frame = -1;
            for(var i = 0; i < this.id.length; i++) {
                if(this.id[i].name === _name) {
                    this.current.animation = i;
                    this.current.frame = 0;
                    this.timer = 0;
                }
            }
        }
    };
    
    Animation.prototype.stop = function() {
        this.halt = true;
    };

    Animation.prototype.nextFrame = function() {
        if(!this.halt) {
            this.timer++;
            if(this.timer > this.id[this.current.animation].speed) {
                this.timer = 0;
                if(!this.reverse) {
                    this.current.frame++;
                    if(this.current.frame >= this.id[this.current.animation].frame.length) {
                        if(this.loop) {
                            this.current.frame = 0;
                        } else {
                            this.current.frame = this.id[this.current.animation].frame.length - 1;
                        }
                    }
                } else {
                    this.current.frame--;
                    if(this.current.frame < 0) {
                        if(this.loop) {
                            this.current.frame = this.id[this.current.animation].frame.length - 1;
                        } else {
                            this.current.frame = 0;
                        }
                    }
                }
            }
        }
    };

    return Animation;

});