function Map(_game) {
	this.game = _game;
	this.canvas = new Array();
	this.context = new Array();
	this.name = null;
    this.visible = true;
    this.image = new Array();
    this.path = '';
    this.json = null;
    this.loaded = false;
    
    return this;
};

Map.prototype.load = function(_name) {
	var self = this;
	this.name = _name;
	var t = _name.split('/');
	for(var i = 0; i < t.length - 1; i++) {
		this.path += t[i] + '/';
	}
	this.ajaxJsonReq(this.name);
};

Map.prototype.ajaxJsonReq = function(_name) {
	var self = this;
    var ajaxReq = new XMLHttpRequest();
    ajaxReq.open("GET", _name, true);
    ajaxReq.setRequestHeader("Content-type", "application/json");
	ajaxReq.addEventListener('readystatechange', function(){self.jsonLoaded(ajaxReq)});
    ajaxReq.send();
};

Map.prototype.jsonLoaded = function(_ajaxReq) {
	if(_ajaxReq.readyState == 4 && _ajaxReq.status == 200) {
        var response = JSON.parse(_ajaxReq.responseText);
        this.json = response;
        this.addProperties();
        this.loadImages();
    }
};

Map.prototype.loadImages = function() {
	var self = this;
	for(var i = 0; i < this.json.tilesets.length; i++) {
		var image = this.game.sprite.loadMap(this.path + this.json.tilesets[i].image);
		this.image.push(image);
	}
	var interval = setInterval(function(){self.loadResources(interval)}, 100);
};

Map.prototype.loadResources = function(_interval) {
	if(this.game.sprite.isLoaded()) {
		clearInterval(_interval);
		this.createContext();
		this.loaded = true;
    }
};

Map.prototype.addProperties = function() {
	for(var i = 0; i < this.json.layers.length; i++) {
		if(this.json.layers[i].type === 'tilelayer') {
			if(this.json.layers[i].properties !== undefined) {
				var main = this.json.layers[i].properties['main'] === 'true'? true : false || false;
				var scrollable = this.json.layers[i].properties['scrollable'] === 'false'? false : true || true;
				var collidable = this.json.layers[i].properties['collidable'] === 'true'? true : false || false;
				var overlap = this.json.layers[i].properties['overlap'] === 'true'? true : false || false;
				var speed = parseFloat(this.json.layers[i].properties['scroll.speed']).toFixed(3) || 1;
				this.json.layers[i].properties = {scroll: {x: 0, y: 0, speed: speed}, main: main, scrollable: scrollable, collidable: collidable, overlap: overlap};
			} else {
				this.json.layers[i]['properties'] = {scroll: {x: 0, y: 0, speed: 1}, main: false, scrollable: true, collidable: false, overlap: false};
			}
		}
	}
};

Map.prototype.createContext = function() {
	for(var i = 0; i < this.json.layers.length; i++) {
		if(this.json.layers[i].type === 'tilelayer') {
			this.canvas.push(document.createElement('canvas'));
			this.context.push(this.canvas[i].getContext('2d'));
	    	this.canvas[i].width = this.json.width * this.json.tilewidth;
	    	this.canvas[i].height = this.json.height * this.json.tileheight;
			for(j = 0; j < this.json.layers[i].data.length; j++) {
				var data = this.json.layers[i].data[j];
				if(data > 0) {
				var tileset = this.getTileset(data);
				this.context[i].save();
				this.context[i].globalAlpha = this.json.layers[i].opacity;
				this.context[i].drawImage(this.image[tileset], Math.floor((data - this.json.tilesets[tileset].firstgid) % this.json.layers[i].width) * this.json.tilesets[tileset].tilewidth, Math.floor((data - this.json.tilesets[tileset].firstgid) / this.json.layers[i].width) * this.json.tilesets[tileset].tilewidth, this.json.tilesets[tileset].tilewidth, this.json.tilesets[tileset].tileheight, Math.floor(j % this.json.layers[i].width) * this.json.tilewidth, Math.floor(j / this.json.layers[i].width) * this.json.tilewidth, this.json.tilewidth, this.json.tileheight);
				this.context[i].restore();
				}
			}
		}
	}
};

Map.prototype.getTileset = function(_data) {
	for(var i = 0; i < this.json.tilesets.length; i++) {
		if(i === this.json.tilesets.length - 1) {
			return i;
		}
		if(this.json.tilesets[i].firstgid > _data) {
			return i - 1;
		}
	}
};

Map.prototype.getMainLayer = function() {
	if(this.json !== null) {
	    for(var i = 0; i < this.json.layers.length; i++) {
	        if(this.game.map.json.layers[i].type === 'tilelayer' && this.json.layers[i].properties.main) {
	            return i;
	        }
	    }
    }
    return -1;
};

Map.prototype.getLayerIdByName = function(_name) {
    for(var i = 0; i < this.json.layers.length; i++) {
        if(this.json.layers[i].name === _name) {
            return i;
        }
    }
    return -1;
};

Map.prototype.getTilesetIdByName = function(_name) {
    for(var i = 0; i < this.json.tilesets.length; i++) {
        if(this.json.tilesets[i].name === _name) {
            return i;
        }
    }
    return -1;
};

Map.prototype.getTile = function(_name, _x, _y, _width, _height) {
	_width = _width || 0;
	_height = _height || 0;
	var layer = this.getLayerIdByName(_name);
	if(this.json.layers[layer].type === 'tilelayer') {
		var tile = (Math.floor(_y / this.json.tileheight) * this.json.layers[layer].width) + Math.floor(_x / this.json.tilewidth);
		if((tile >= this.json.layers[layer].data.length || tile < 0) || (_x > this.json.layers[layer].width * this.json.tilewidth || _x + _width < 0) || (_y > this.json.layers[layer].height * this.json.tileheight || _y + _height < 0)) {
			return null;
		} else {
			return tile;
		}
	} else {
		return null;
	}
};

Map.prototype.getTileData = function(_name, _x, _y) {
	var layer = this.getLayerIdByName(_name);
	var tile = this.getTile(_name, _x, _y);
	if(tile === null) {
		return null;
	} else {
		return this.json.layers[layer].data[tile];	
	}
};

Map.prototype.clearTile = function(_name, _x, _y) {
	var id = this.getLayerIdByName(_name);
	var layer = this.json.layers[id];
	var tile = this.getTile(_name, _x, _y);
	if(tile !== null) {
		layer.data[tile] = 0;
		this.context[id].save();
		this.context[id].globalAlpha = layer.opacity;
		this.context[id].clearRect(Math.floor(tile % this.json.layers[id].width) * this.json.tilewidth, Math.floor(tile / this.json.layers[id].width) * this.json.tilewidth, this.json.tilewidth, this.json.tileheight);
		this.context[id].restore();
	}
};

Map.prototype.setTile = function(_name, _x, _y, _tileset, _tile) {
	var id = this.getLayerIdByName(_name);
	var layer = this.json.layers[id];
	var tile = this.getTile(_name, _x, _y);
	var tileset = this.getTilesetIdByName(_tileset);
	var data = _tile + this.json.tilesets[tileset].firstgid;
	if(tile !== null) {
		layer.data[tile] = data;
		this.context[id].save();
		this.context[id].globalAlpha = this.json.layers[id].opacity;
		this.context[id].drawImage(this.image[tileset], Math.floor((data - this.json.tilesets[tileset].firstgid) % this.json.layers[id].width) * this.json.tilesets[tileset].tilewidth, Math.floor((data - this.json.tilesets[tileset].firstgid) / this.json.layers[id].width) * this.json.tilesets[tileset].tilewidth, this.json.tilesets[tileset].tilewidth, this.json.tilesets[tileset].tileheight, Math.floor(tile % this.json.layers[id].width) * this.json.tilewidth, Math.floor(tile / this.json.layers[id].width) * this.json.tilewidth, this.json.tilewidth, this.json.tileheight);
		this.context[id].restore();
	}
};

Map.prototype.update = function() {
	if(this.json !== null) {
		for(var i = 0; i < this.json.layers.length; i++) {
			if(this.json.layers[i].type === 'tilelayer') {
				this.json.layers[i].x += this.json.layers[i].properties.scroll.x;
				this.json.layers[i].y += this.json.layers[i].properties.scroll.y;
				this.json.layers[i].x = parseFloat(this.json.layers[i].x.toFixed(3));
				this.json.layers[i].y = parseFloat(this.json.layers[i].y.toFixed(3));
			}
		}
	}
};

Map.prototype.resetScroll = function() {
	if(this.json !== null) {
		for(var i = 0; i < this.json.layers.length; i++) {
			if(this.json.layers[i].type === 'tilelayer') {
				this.json.layers[i].properties.scroll.x = 0;
				this.json.layers[i].properties.scroll.y = 0;
			}
		}
	}
};

Map.prototype.resetPosition = function() {
	for(var i = 0; i < this.json.layers.length; i++) {
		if(this.json.layers[i].type === 'tilelayer') {
			this.json.layers[i].x = 0;
			this.json.layers[i].y = 0;
		}
	}
};

Map.prototype.draw = function(_overlap) {
	for(var i = 0; i < this.canvas.length; i++) {
		if(this.json.layers[i].type === 'tilelayer' && this.json.layers[i].visible && this.json.layers[i].properties.overlap === _overlap) {
			var w = this.game.canvas.width > this.canvas[i].width ? this.canvas[i].width : this.game.canvas.width;
			var h = this.game.canvas.height > this.canvas[i].height ? this.canvas[i].height : this.game.canvas.height;
			this.game.context.save();
			this.game.context.drawImage(this.canvas[i], Math.round(-this.json.layers[i].x), Math.round(-this.json.layers[i].y), w, h, 0, 0, w, h);
			this.game.context.restore();
		}
	}
};