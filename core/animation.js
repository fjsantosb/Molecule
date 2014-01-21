// Animation var.
function Animation() {
	this.frame = new Array();
	this.id = new Array();
	this.current = {animation: 0, frame: 0};
	this.timer = 0;
	
	return this;
};

// Method to get frames of the sprite sheet
Animation.prototype.sliceFrames = function(_imageWidth, _imageHeight, _frameWidth, _frameHeight) {
	for(var i = 0; i < _imageHeight - 1; i += _frameHeight) {
		for(var j = 0; j < _imageWidth - 1; j += _frameWidth) {
			this.frame.push({x:j, y:i});
		}
	}
	if(_imageWidth === _frameWidth && _imageHeight === _frameHeight) {
		this.add('', [0], 60);
	}
};

// Method to add an animation
Animation.prototype.add = function(_name, _frames, _speed) {
	this.id.push({name: _name, frame: _frames, speed: _speed});
};

//Method to play current animation
Animation.prototype.run = function(_name) {
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

// Method to get next animation frame
Animation.prototype.nextFrame = function() {
	this.timer++;
	if(this.timer > this.id[this.current.animation].speed) {
		this.timer = 0;
		this.current.frame++;
		if(this.current.frame >= this.id[this.current.animation].frame.length) {
			this.current.frame = 0;
		}
	}
};