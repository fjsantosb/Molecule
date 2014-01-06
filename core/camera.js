// Camera var. Arguments: canvas
function Camera() {
	this.map = null;
	this.layer = null;
	this.sprite = null;
	this.scroll = {x: false, y: false};
	this.type = 0;
	
	return this;
};

// Method for attach an sprite, map, and main layer
Camera.prototype.attach = function(_scene, _sprite, _layer) {
	this.layer = _scene.map.getLayerIdByName(_layer);
	this.sprite = _sprite;
	this.type = 1;
};

// Method for update the camera. It will update map & sprite
Camera.prototype.update = function(_map, _sprite) {
	if(_map !== null) {
		this.makeScroll(_map);
		this.makeMapScroll(_map);
	}
	this.makeSpriteScroll(_sprite, this.sprite.move.x, this.sprite.move.y);
};

// Method to check if scroll is necessary
Camera.prototype.makeScroll = function(_map) {
	this.scroll.x = false;
	this.scroll.y = false;
	if(_map.layer.length > 0 && _map.layer[this.layer].scrollable) {
		if((-_map.layer[this.layer].position.x + Game.canvas.width < _map.width * _map.tile.width && this.sprite.move.x > 0 && this.sprite.position.x + this.sprite.frame.width / 2 >= Game.canvas.width / 2) || (-_map.layer[this.layer].position.x > 0 && this.sprite.move.x < 0 && this.sprite.position.x + this.sprite.frame.width / 2 <= Game.canvas.width / 2)) {
			this.scroll.x = true;
		}
		if((-_map.layer[this.layer].position.y + Game.canvas.height < _map.height * _map.tile.height && this.sprite.move.y > 0 && this.sprite.position.y + this.sprite.frame.height / 2>= Game.canvas.height / 2) || (-_map.layer[this.layer].position.y > 0 && this.sprite.move.y < 0 && this.sprite.position.y + this.sprite.frame.height / 2<= Game.canvas.height / 2)) {
			this.scroll.y = true;
		}
	}
};

// Method to scroll map
Camera.prototype.makeMapScroll = function(_map) {
	for(var i = 0; i < _map.layer.length; i++) {
		if(_map.layer[i].scrollable) {
			if((-_map.layer[i].position.x + Game.canvas.width < _map.width * _map.tile.width && this.sprite.move.x > 0 && this.sprite.position.x + this.sprite.frame.width / 2 >= Game.canvas.width / 2) || (-_map.layer[i].position.x > 0 && this.sprite.move.x < 0 && this.sprite.position.x + this.sprite.frame.width / 2 <= Game.canvas.width / 2)) {
				if(this.scroll.x) {
					if(i !== this.layer) {
						_map.layer[i].scroll.x = this.sprite.move.x * -_map.layer[i].scroll.speed;
					} else {
						_map.layer[i].scroll.x = -this.sprite.move.x;
					}
					
				}
			}
			if((-_map.layer[i].position.y + Game.canvas.height < _map.height * _map.tile.height && this.sprite.move.y > 0 && this.sprite.position.y + this.sprite.frame.height / 2>= Game.canvas.height / 2) || (-_map.layer[i].position.y > 0 && this.sprite.move.y < 0 && this.sprite.position.y + this.sprite.frame.height / 2<= Game.canvas.height / 2)) {
				if(this.scroll.y) {
					if(i !== this.layer) {
						_map.layer[i].scroll.y = this.sprite.move.y * -_map.layer[i].scroll.speed;
					} else {
						_map.layer[i].scroll.y = -this.sprite.move.y;
					}
				}
			}
		}
	}
};

// Method to scroll sprite
Camera.prototype.makeSpriteScroll = function(_sprite, _x, _y) {
	for(var i = 0; i < _sprite.length; i++) {
		if(_sprite[i].scrollable) {
			if(this.scroll.x) {
				_sprite[i].move.x = _sprite[i].move.x - _x;
			}
			if(this.scroll.y) {
				_sprite[i].move.y = _sprite[i].move.y - _y;
			}
		}
	}
};