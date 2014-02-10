function MapFile(_game) {
	this.game = _game;
	this.tile = new Tile(_game);
	this.map = new Array();
};

MapFile.prototype.load = function(_name) {
	var m = new Map(this.game);
	m.load(_name);
	this.map.push(m);
	return m;
};

MapFile.prototype.isLoaded = function() {
	var loaded = true;
	for(var i = 0; i < this.map.length; i++) {
		if(!this.map[i].loaded) {
			loaded = false;
		}
	}
	return loaded;
};

MapFile.prototype.set = function(_map, _reset) {
	_reset = _reset || false;
	this.game.camera.detach();
	if(_reset)
		_map.reset();
	this.game.map = _map;
};

MapFile.prototype.sprite = function(_name) {
	for(var i = 0; i < this.game.map.json.layers.length; i++) {
		if(this.game.map.json.layers[i].type === 'objectgroup') {
			for(var j = 0; j < this.game.map.json.layers[i].objects.length; j++) {
				if(this.game.map.json.layers[i].objects[j].name === _name) {
					var _sprite = this.game.sprite.load(this.game.map.path + _name, this.game.map.json.layers[i].objects[j].tilewidth, this.game.map.json.layers[i].objects[j].tileheight);
					_sprite.getAnimation();
					_sprite.name = this.game.map.json.layers[i].objects[j].name;
					_sprite.position.x = parseInt(this.game.map.json.layers[i].objects[j].x);
					_sprite.position.y = parseInt(this.game.map.json.layers[i].objects[j].y) - _sprite.frame.height;
					_sprite.visible = this.game.map.json.layers[i].objects[j].visible;
					_sprite.anchor.x = parseInt(this.game.map.json.layers[i].objects[j].properties['anchor.x']) || _sprite.anchor.x;
					_sprite.anchor.y = parseInt(this.game.map.json.layers[i].objects[j].properties['anchor.y']) || _sprite.anchor.y;
					_sprite.flip.x = parseInt(this.game.map.json.layers[i].objects[j].properties['flip.x']) || _sprite.flip.x;
					_sprite.flip.y = parseInt(this.game.map.json.layers[i].objects[j].properties['flip.y']) || _sprite.flip.y;
					_sprite.frame.width = parseInt(this.game.map.json.layers[i].objects[j].properties['frame.width']) || _sprite.frame.width;
					_sprite.frame.height = parseInt(this.game.map.json.layers[i].objects[j].properties['frame.height']) || _sprite.frame.height;
					_sprite.frame.offset.width = parseInt(this.game.map.json.layers[i].objects[j].properties['frame.offset.width']) || _sprite.frame.offset.width;
					_sprite.frame.offset.height = parseInt(this.game.map.json.layers[i].objects[j].properties['frame.offset.heigh']) || _sprite.frame.offset.height;
					_sprite.collides.sprite = this.game.map.json.layers[i].objects[j].properties['collides.sprite'] === 'true' ? true : false || _sprite.collides.sprite;
					_sprite.collides.map = this.game.map.json.layers[i].objects[j].properties['collides.map'] === 'true' ? true : false || _sprite.collides.map;
					_sprite.scrollable = this.game.map.json.layers[i].objects[j].properties['scrollable'] === 'true' ? true : false || _sprite.scrollable;
					_sprite.collidable = this.game.map.json.layers[i].objects[j].properties['collidable'] === 'true' ? true : false || _sprite.collidable;
					_sprite.speed.min.x = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.min.x']).toFixed(3) || _sprite.speed.min.x;
					_sprite.speed.min.y = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.min.y']).toFixed(3) || _sprite.speed.min.y;
					_sprite.speed.max.x = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.max.x']).toFixed(3) || _sprite.speed.max.x;
					_sprite.speed.max.y = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.max.y']).toFixed(3) || _sprite.speed.max.y;
					_sprite.affects.physics.gravity = this.game.map.json.layers[i].objects[j].properties['affects.physics.gravity'] === 'true' ? true : false || _sprite.affects.physics.gravity;
					_sprite.affects.physics.friction = this.game.map.json.layers[i].objects[j].properties['affects.physics.friction'] === 'true' ? true : false || _sprite.affects.physics.friction;
					_sprite.bounciness = this.game.map.json.layers[i].objects[j].properties['bounciness'] === 'true' ? true : false || _sprite.bounciness;
					return _sprite;
				}
			}
		}
	}
};