function Scene(_game) {
	this.sprite = new Array();
	this.map = _game.map;
	this.camera = _game.camera;
	this.physics = _game.physics;
    this.boundaries = _game.boundaries;
	this.loaded = false;
	this.status = 1;
	
	return this;
};

Scene.prototype.addGame = function(_game) {
	_game.scene.push(_scene);
};

Scene.prototype.loadMap = function(_map) {
	this.map.load(_map);
	this.loadMapSprites();
};

Scene.prototype.cameraFollow = function(_sprite, _layer) {
	this.camera.attach(this, _sprite, _layer);
};

Scene.prototype.loadMapSprites = function() {
	for(var i = 0; i < this.map.sprite.length; i++) {
		var _sprite = null;
		_sprite = (typeof window[this.map.sprite[i].object.type] === 'function') ? new window[this.map.sprite[i].object.type] : null;
		_sprite.name = this.map.sprite[i].object.name;
		_sprite.position.x = this.map.sprite[i].object.x;
		_sprite.position.y = this.map.sprite[i].object.y;
		_sprite.position.x = parseInt(_sprite.position.x);
		_sprite.position.y = parseInt(_sprite.position.y);
		for(var j = 0; j < this.map.sprite[i].property.length; j++) {
			switch(this.map.sprite[i].property[j].name) {
				case 'position.offset.x':
					_sprite.position.offset.x = this.map.sprite[i].property[j].value;
					_sprite.position.offset.x = parseInt(_sprite.position.offset.x);
					break;
				case 'position.offset.y':
					_sprite.position.offset.y = this.map.sprite[i].property[j].value;
					_sprite.position.offset.y = parseInt(_sprite.position.offset.y);
					break;
				case 'flip.x':
					_sprite.flip.x = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'flip.y':
					_sprite.flip.y = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'visible':
					_sprite.visible = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'frame.width':
					_sprite.frame.width = this.map.sprite[i].property[j].value;
					_sprite.frame.width = parseInt(_sprite.frame.width);
					break;
				case 'frame.height':
					_sprite.frame.height = this.map.sprite[i].property[j].value;
					_sprite.frame.height = parseInt(_sprite.frame.height);
					break;
				case 'frame.offset.width':
					_sprite.frame.offset.width = this.map.sprite[i].property[j].value;
					_sprite.frame.offset.width = parseInt(_sprite.frame.offset.width);
					break;
				case 'frame.offset.height':
					_sprite.frame.offset.height = this.map.sprite[i].property[j].value;
					_sprite.frame.offset.height = parseInt(_sprite.frame.offset.height);
					break;
				case 'collides.sprite':
					_sprite.collides.sprite = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'collides.map':
					_sprite.collides.map = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'scrollable':
					_sprite.scrollable = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'collidable':
					_sprite.collidable = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'speed.min.x':
					_sprite.speed.min.x = this.map.sprite[i].property[j].value;
					_sprite.speed.min.x = parseFloat(_sprite.speed.min.x).toFixed(3);
					break;
				case 'speed.min.y':
					_sprite.speed.min.y = this.map.sprite[i].property[j].value;
					_sprite.speed.min.y = parseFloat(_sprite.speed.min.y).toFixed(3);
					break;
				case 'speed.max.x':
					_sprite.speed.max.x = this.map.sprite[i].property[j].value;
					_sprite.speed.max.x = parseFloat(_sprite.speed.max.x).toFixed(3);
					break;
				case 'speed.max.y':
					_sprite.speed.max.y = this.map.sprite[i].property[j].value;
					_sprite.speed.max.y = parseFloat(_sprite.speed.max.y).toFixed(3);
					break;
				case 'affects.physics.gravity':
					_sprite.affects.physics.gravity = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'affects.physics.friction':
					_sprite.affects.physics.friction = this.map.sprite[i].property[j].value === 'true' ? true : false;
					break;
				case 'bounciness':
					_sprite.bounciness = this.map.sprite[i].property[j].value;
					_sprite.bounciness = parseFloat(_sprite.bounciness).toFixed(3);
					break;
			}
		}
		this.addSprite(_sprite);
	}
};

Scene.prototype.addSprite = function(_sprite) {
	this.sprite.push(_sprite);
};

Scene.prototype.getSpriteByName = function(_name) {
	for(var i = 0; i < this.sprite.length; i++) {
        if(this.sprite[i].name === _name) {
            return this.sprite[i];
        }
    }
    return -1;
};

Scene.prototype.getSpriteByIndex = function(_i) {
	return this.sprite[_i];
};

Scene.prototype.setBoundaries = function(_x, _y, _width, _height) {
	this.boundaries.x = _x;
	this.boundaries.y = _y;
	this.boundaries.width = _width;
	this.boundaries.height = _height;
};

Scene.prototype.play = function() {
	this.status = 1;
};

Scene.prototype.stop = function() {
	this.status = 0;
};