var ImageFile = new function() {
	this.name = new Array();
	this.data = new Array();
	this.counter = 0;
	
	this.load = function(_imageSrc, _imageName) {
		if(!this.getImageDataByName(_imageName)) {
			var _image = new Image();
			_image.src = _imageSrc;
			_image.addEventListener('load', function(){Game.imageFile.counter++;});
			Game.imageFile.name.push(_imageName);
			Game.imageFile.data.push(_image);
		}
	};
	
	this.isLoaded = function() {
		if(Game.imageFile.counter === Game.imageFile.data.length) {
			return true;
		}
		return false;
	};

	this.getImageDataByName = function(_imageName) {
		return Game.imageFile.data[Game.imageFile.name.indexOf(_imageName)];
	};
	
};