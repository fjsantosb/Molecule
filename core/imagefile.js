function ImageFile(_game) {
	this.game = _game;
	this.name = new Array();
	this.data = new Array();
	this.counter = 0;
	
	return this;
};
	
ImageFile.prototype.load = function(_imageSrc, _width, _height) {
	if(!this.getImageDataByName(_imageSrc)) {
		var self = this;
		var _image = new Image();
		_image.src = _imageSrc;
		_image.addEventListener('load', function(){self.counter++});
		this.name.push(_imageSrc);
		this.data.push(_image);
	}
	
	var s = new Sprite(_imageSrc, _width, _height);
	s.game = this.game;
	s.image = this.getImageDataByName(_imageSrc);
	this.game.scene.sprite.push(s);
	return s;
};

ImageFile.prototype.loadMap = function(_imageSrc, _width, _height) {
	if(!this.getImageDataByName(_imageSrc)) {
		var self = this;
		var _image = new Image();
		_image.src = _imageSrc;
		_image.addEventListener('load', function(){self.counter++});
		this.name.push(_imageSrc);
		this.data.push(_image);
	}
	
	return this.getImageDataByName(_imageSrc);
}
	
ImageFile.prototype.isLoaded = function() {
	if(this.counter === this.data.length) {
		return true;
	}
	return false;
};

ImageFile.prototype.getImageDataByName = function(_imageName) {
	return this.data[this.name.indexOf(_imageName)];
};