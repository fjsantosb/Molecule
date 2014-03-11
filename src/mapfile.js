Molecule.module('Molecule.MapFile', function (require, p) {

    var Tile = require('Molecule.Tile'),
        Map = require('Molecule.Map');

	function MapFile(_game) {
		this.game = _game;
		this.tile = new Tile(_game);
		this.maps = [];
	};

	MapFile.prototype.load = function(_id, _name) {
		var m = new Map(this.game);
		m.load(_id, _name);
		this.maps.push(m);
		return m;
	};

	MapFile.prototype.isLoaded = function() {
		var loaded = true;
		for(var i = 0; i < this.maps.length; i++) {
			if(!this.maps[i].loaded) {
				loaded = false;
			}
		}
		return loaded;
	};

    MapFile.prototype.getCounter = function() {
        var c = 0;
    	for(var i = 0; i < this.maps.length; i++) {
    		if(this.maps[i].loaded) {
    			c++;
    		}
		}
		return c;
    };

	MapFile.prototype.set = function(_map, _reset) {
		_reset = _reset || false;
		this.game.camera.detach();
		if(_reset)
			_map.reset();
		this.game.map = _map;
        this.game.map.createContext();
	};

    MapFile.prototype.sprite = function(i, j, _sprite, _path) {
        _sprite.name = this.game.map.json.layers[i].objects[j].name;
        _sprite.image = this.game.imageFile.getImageDataByName(_path + _sprite.name);
        _sprite.position.x = parseInt(this.game.map.json.layers[i].objects[j].x);
        _sprite.position.y = parseInt(this.game.map.json.layers[i].objects[j].y) - _sprite.frame.height;
        _sprite.visible = this.game.map.json.layers[i].objects[j].visible;
        _sprite.anchor.x = parseInt(this.game.map.json.layers[i].objects[j].properties['anchor.x']) || _sprite.anchor.x;
        _sprite.anchor.y = parseInt(this.game.map.json.layers[i].objects[j].properties['anchor.y']) || _sprite.anchor.y;
        _sprite.flip.x = parseInt(this.game.map.json.layers[i].objects[j].properties['flip.x']) || _sprite.flip.x;
        _sprite.flip.y = parseInt(this.game.map.json.layers[i].objects[j].properties['flip.y']) || _sprite.flip.y;
        _sprite.frame.width = parseInt(this.game.map.json.layers[i].objects[j].properties['frame.width']) || _sprite.frame.width;
        _sprite.frame.height = parseInt(this.game.map.json.layers[i].objects[j].properties['frame.height']) || _sprite.frame.height;
        _sprite.frame.offset.x = parseInt(this.game.map.json.layers[i].objects[j].properties['frame.offset.x']) || _sprite.frame.offset.x;
        _sprite.frame.offset.y = parseInt(this.game.map.json.layers[i].objects[j].properties['frame.offset.y']) || _sprite.frame.offset.y;
        _sprite.collides.sprite = this.game.map.json.layers[i].objects[j].properties['collides.sprite'] === 'false' ? false : true || _sprite.collides.sprite;
        _sprite.collides.map = this.game.map.json.layers[i].objects[j].properties['collides.map'] === 'false' ? false : true || _sprite.collides.map;
        _sprite.scrollable = this.game.map.json.layers[i].objects[j].properties['scrollable'] === 'false' ? false : true || _sprite.scrollable;
        _sprite.collidable = this.game.map.json.layers[i].objects[j].properties['collidable'] === 'false' ? false : true || _sprite.collidable;
        _sprite.speed.min.x = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.min.x']).toFixed(3) || _sprite.speed.min.x;
        _sprite.speed.min.y = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.min.y']).toFixed(3) || _sprite.speed.min.y;
        _sprite.speed.max.x = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.max.x']).toFixed(3) || _sprite.speed.max.x;
        _sprite.speed.max.y = parseFloat(this.game.map.json.layers[i].objects[j].properties['speed.max.y']).toFixed(3) || _sprite.speed.max.y;
        _sprite.affects.physics.gravity = this.game.map.json.layers[i].objects[j].properties['affects.physics.gravity'] === 'false' ? false : true || _sprite.affects.physics.gravity;
        _sprite.affects.physics.friction = this.game.map.json.layers[i].objects[j].properties['affects.physics.friction'] === 'false' ? false : true || _sprite.affects.physics.friction;
        _sprite.bounciness = this.game.map.json.layers[i].objects[j].properties['bounciness'] === 'true' ? true : false || _sprite.bounciness;
        _sprite.overlap = this.game.map.json.layers[i].objects[j].properties['overlap'] === 'true' ? true : false || _sprite.overlap;
    };

    return MapFile;

});