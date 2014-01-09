function ImageFile() {
	this.name = new Array();
	this.data = new Array();
	this.counter = 0;
};
	
ImageFile.prototype.load = function(_imageSrc, _imageName) {
	if(!this.getImageDataByName(_imageName)) {
		var self = this;
		var _image = new Image();
		_image.src = _imageSrc;
		_image.addEventListener('load', function(){self.counter++;});
		this.name.push(_imageName);
		this.data.push(_image);
	}
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