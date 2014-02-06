function MapFile(_game) {
	this.game = _game;
	this.tile = new Tile(_game);
};

MapFile.prototype.load = function(_name) {
	var m = new Map(this.game);
	m.load(_name);
	return m;
};

MapFile.prototype.set = function(_map) {
	this.game.map = _map;
	this.game.camera.detach();
};

MapFile.prototype.sprite = function(_sprite, _name) {
	for(var i = 0; i < this.game.map.sprite.length; i++) {
		if(this.game.map.sprite[i].object.name === _name) {
			_sprite.name = this.game.map.sprite[i].object.name;
			_sprite.position.x = this.game.map.sprite[i].object.x;
			_sprite.position.y = this.game.map.sprite[i].object.y;
			_sprite.position.x = parseInt(_sprite.position.x);
			_sprite.position.y = parseInt(_sprite.position.y - _sprite.frame.height);
			for(var j = 0; j < this.game.map.sprite[i].property.length; j++) {
				switch(this.game.map.sprite[i].property[j].name) {
					case 'anchor.x':
						_sprite.anchor.x = this.game.map.sprite[i].property[j].value;
						_sprite.anchor.x = parseInt(_sprite.anchor.x);
						break;
					case 'anchor.y':
						_sprite.anchor.y = this.game.map.sprite[i].property[j].value;
						_sprite.anchor.y = parseInt(_sprite.anchor.y);
						break;
					case 'flip.x':
						_sprite.flip.x = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'flip.y':
						_sprite.flip.y = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'visible':
						_sprite.visible = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'frame.width':
						_sprite.frame.width = this.game.map.sprite[i].property[j].value;
						_sprite.frame.width = parseInt(_sprite.frame.width);
						break;
					case 'frame.height':
						_sprite.frame.height = this.game.map.sprite[i].property[j].value;
						_sprite.frame.height = parseInt(_sprite.frame.height);
						break;
					case 'frame.offset.width':
						_sprite.frame.offset.width = this.game.map.sprite[i].property[j].value;
						_sprite.frame.offset.width = parseInt(_sprite.frame.offset.width);
						break;
					case 'frame.offset.height':
						_sprite.frame.offset.height = this.game.map.sprite[i].property[j].value;
						_sprite.frame.offset.height = parseInt(_sprite.frame.offset.height);
						break;
					case 'collides.sprite':
						_sprite.collides.sprite = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'collides.map':
						_sprite.collides.map = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'scrollable':
						_sprite.scrollable = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'collidable':
						_sprite.collidable = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'speed.min.x':
						_sprite.speed.min.x = this.game.map.sprite[i].property[j].value;
						_sprite.speed.min.x = parseFloat(_sprite.speed.min.x).toFixed(3);
						break;
					case 'speed.min.y':
						_sprite.speed.min.y = this.game.map.sprite[i].property[j].value;
						_sprite.speed.min.y = parseFloat(_sprite.speed.min.y).toFixed(3);
						break;
					case 'speed.max.x':
						_sprite.speed.max.x = this.game.map.sprite[i].property[j].value;
						_sprite.speed.max.x = parseFloat(_sprite.speed.max.x).toFixed(3);
						break;
					case 'speed.max.y':
						_sprite.speed.max.y = this.game.map.sprite[i].property[j].value;
						_sprite.speed.max.y = parseFloat(_sprite.speed.max.y).toFixed(3);
						break;
					case 'affects.physics.gravity':
						_sprite.affects.physics.gravity = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'affects.physics.friction':
						_sprite.affects.physics.friction = this.game.map.sprite[i].property[j].value === 'true' ? true : false;
						break;
					case 'bounciness':
						_sprite.bounciness = this.game.map.sprite[i].property[j].value;
						_sprite.bounciness = parseFloat(_sprite.bounciness).toFixed(3);
						break;
				}
			}
		}
	}
};