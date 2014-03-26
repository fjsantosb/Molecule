Molecule.module('Molecule.MapFile', function (require, p) {

    var Tile = require('Molecule.Tile'),
        Map = require('Molecule.Map');

    p.Boolean = function (bool) {
        return (bool === 'true');
    };

    p.getProperty = function (property, Type, objectProperties, layerProperties, fallbackProperty) {

        if (typeof objectProperties[property] !== 'undefined') {
            return Type(objectProperties[property]);
        }

        if (typeof layerProperties[property] !== 'undefined') {
            return Type(layerProperties[property]);
        }

        return fallbackProperty;

    };

    p.getMoleculeType = function (object, tilesets) {
        var gid = object.gid;
        for (var x = 0; x < tilesets.length; x++) {
            if (tilesets[x].firstgid === gid) {
                return tilesets[x].name;
            }
        }
    };

	function MapFile(_game) {
		this.game = _game;
		this.tile = new Tile(_game);
		this.maps = [];
	}

	MapFile.prototype.load = function(_id, _name) {
		var m = new Map(this.game);
		m.load(_id, _name);
        m._MoleculeType = _id;
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
		this.game.camera.unfollow();
		if(_reset)
			_map.reset();
		this.game.map = _map;
        this.game.map.createContext();
	};

    MapFile.prototype.copyMapProperties = function(i, j, _sprite, _path) {

        var objectProperties =this.game.map.json.layers[i].objects[j].properties || {},
            layerProperties = this.game.map.json.layers[i].properties || {};

        _sprite._MoleculeType = p.getMoleculeType(this.game.map.json.layers[i].objects[j], this.game.map.json.tilesets);
        _sprite.position.x = parseInt(this.game.map.json.layers[i].objects[j].x);
        _sprite.position.y = parseInt(this.game.map.json.layers[i].objects[j].y) - _sprite.frame.height;
        _sprite.visible = this.game.map.json.layers[i].objects[j].visible;
        _sprite.anchor.x = p.getProperty('anchor.x', Number, objectProperties, layerProperties, _sprite.anchor.x);
        _sprite.anchor.y = p.getProperty('anchor.y', Number, objectProperties, layerProperties, _sprite.anchor.y);
        _sprite.flip.x = p.getProperty('flip.x', Number, objectProperties, layerProperties, _sprite.flip.x);
        _sprite.flip.y = p.getProperty('flip.y', Number, objectProperties, layerProperties, _sprite.flip.y);
        _sprite.collides.sprite =  p.getProperty('collides.sprite', p.Boolean, objectProperties, layerProperties, _sprite.collides.sprite);
        _sprite.collides.map = p.getProperty('collides.map', p.Boolean, objectProperties, layerProperties, _sprite.collides.map);
        _sprite.scrollable = p.getProperty('scrollable', p.Boolean, objectProperties, layerProperties, _sprite.scrollable);
        _sprite.collidable = p.getProperty('collidable', p.Boolean, objectProperties, layerProperties, _sprite.collidable);
        _sprite.speed.min.x = p.getProperty('speed.min.x', Number, objectProperties, layerProperties, _sprite.speed.min.x);
        _sprite.speed.min.y = p.getProperty('speed.min.y', Number, objectProperties, layerProperties, _sprite.speed.min.y);
        _sprite.speed.max.x = p.getProperty('speed.max.x', Number, objectProperties, layerProperties, _sprite.speed.max.x);
        _sprite.speed.max.y = p.getProperty('speed.max.y', Number, objectProperties, layerProperties, _sprite.speed.max.y);
        _sprite.affects.physics.gravity = p.getProperty('affects.physics.gravity', p.Boolean, objectProperties, layerProperties, _sprite.affects.physics.gravity);
        _sprite.affects.physics.friction = p.getProperty('affects.physics.friction', p.Boolean, objectProperties, layerProperties, _sprite.affects.physics.friction);
        _sprite.overlap = p.getProperty('overlap', p.Boolean, objectProperties, layerProperties, _sprite.overlap);

    };

    return MapFile;

});