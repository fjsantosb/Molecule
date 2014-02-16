function ImageFile(_game) {
	this.game = _game;
	this.name = new Array();
	this.data = new Array();
	this.counter = 0;
	
	return this;
};

ImageFile.prototype.image = function(_imageSrc) {
	var _name = _imageSrc.substring(0, _imageSrc.length - 4);
	if(!this.getImageDataByName(_name)) {
		var self = this;
		var _image = new Image();
		_image.addEventListener('load', function(){self.counter++});
		_image.src = _imageSrc;
		this.name.push(_name);
		this.data.push(_image);
	}
	
	return this.getImageDataByName(_name);
};

ImageFile.prototype.load = function(_imageSrc, _width, _height) {
	var s = new Sprite(_imageSrc, _width, _height);
	s.game = this.game;
	s.image = this.image(_imageSrc);
	if(this.isLoaded());
		s.getAnimation();
	this.game.scene.sprite.push(s);
	return s;
};

ImageFile.prototype.reset = function() {
	this.game.scene.sprite = [];
};
	
ImageFile.prototype.isLoaded = function() {
	if(this.counter === this.data.length) {
		return true;
	}
	return false;
};

ImageFile.prototype.getImageDataByName = function(_imageName) {
	return this.data[this.name.indexOf(_imageName)];
};