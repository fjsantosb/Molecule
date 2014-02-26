Molecule.module('Molecule.MapFile', function (require, p) {

    var Tile = require('Molecule.Tile'),
        Map = require('Molecule.Map');

	function MapFile(_game) {
		this.game = _game;
		this.tile = new Tile(_game);
		this.map = [];
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
						var _tileset = this.game.map.getTileset(this.game.map.json.layers[i].objects[j].gid);
						var _sprite = this.game.sprite.load(this.game.map.path + this.game.map.json.tilesets[this.game.map.getTilesetIdByName(_name)].image, this.game.map.json.tilesets[_tileset].tilewidth, this.game.map.json.tilesets[_tileset].tileheight);
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
						_sprite.collides.sprite = this.game.map.json.layers[i].objects[j].properties['collides.sprite'] === 'false' ? false : true || true;
						_sprite.collides.map = this.game.map.json.layers[i].objects[j].properties['collides.map'] === 'false' ? false : true || true;
						_sprite.scrollable = this.game.map.json.layers[i].objects[j].properties['scrollable'] === 'false' ? false : true || true;
						_sprite.collidable = this.game.map.json.layers[i].objects[j].properties['collidable'] === 'false' ? false : true || true;
						_sprite.speed.min.x = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.min.x']).toFixed(3) || _sprite.speed.min.x;
						_sprite.speed.min.y = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.min.y']).toFixed(3) || _sprite.speed.min.y;
						_sprite.speed.max.x = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.max.x']).toFixed(3) || _sprite.speed.max.x;
						_sprite.speed.max.y = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.max.y']).toFixed(3) || _sprite.speed.max.y;
						_sprite.affects.physics.gravity = this.game.map.json.layers[i].objects[j].properties['affects.physics.gravity'] === 'false' ? false : true || true;
						_sprite.affects.physics.friction = this.game.map.json.layers[i].objects[j].properties['affects.physics.friction'] === 'false' ? false : true || true;
						_sprite.bounciness = this.game.map.json.layers[i].objects[j].properties['bounciness'] === 'true' ? true : false || false;
						_sprite.overlap = this.game.map.json.layers[i].objects[j].properties['overlap'] === 'true' ? true : false || false;
						return _sprite;
					}
				}
			}
		}
	};

	return MapFile;

});