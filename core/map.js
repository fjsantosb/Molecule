function Map(_game) {
	this.game = _game;
	this.canvas = new Array();
	this.context = new Array();
	this.name = null;
	this.xmlHttp = null;
	this.xmlDoc = null;
	this.tileset = new Array();
    this.layer = new Array();
    this.data = new Array();
    this.width = null;
    this.height = null;
    this.tile = {width: null, height: null};
    this.visible = true;
    this.sprite = new Array();
    this.path = '';
    
    return this;
};

Map.prototype.load = function(_name) {
	var self = this;
	var t = _name.split('/');
	for(var i = 0; i < t.length - 1; i++) {
		this.path += t[i] + '/';
	}
	this.name = _name;
    this.xmlHttp = new XMLHttpRequest();
    if(this.xmlHttp.overrideMimeType) {
    	this.xmlHttp.overrideMimeType("text/xml");
    }
    this.xmlHttp.open("GET", this.name, false);
	this.xmlHttp.send();
    if(this.xmlHttp.status === 200) {
		this.xmlDoc = this.xmlHttp.responseXML;
    }
    
    this.width = parseInt(this.xmlDoc.getElementsByTagName("map")[0].getAttribute("width"));
    this.height = parseInt(this.xmlDoc.getElementsByTagName("map")[0].getAttribute("height"));
    this.tile.width = parseInt(this.xmlDoc.getElementsByTagName("map")[0].getAttribute("tilewidth"));
    this.tile.height = parseInt(this.xmlDoc.getElementsByTagName("map")[0].getAttribute("tileheight"));
    
    this.totalImages = this.xmlDoc.getElementsByTagName("tileset").length;
    
    for(var i = 0; i < this.xmlDoc.getElementsByTagName("tileset").length; i++) {
        this.tileset.push(self.createTileset(i));
    }
	
    for(var i = 0; i < this.xmlDoc.getElementsByTagName("layer").length; i++) {
        this.layer.push(self.createLayer(i));
    }
    
    for(var i = 0; i < this.xmlDoc.getElementsByTagName("object").length; i++) {
    	var _s = {name: this.xmlDoc.getElementsByTagName("object")[i].getAttribute("name"), type: this.xmlDoc.getElementsByTagName("object")[i].getAttribute("type"), x: this.xmlDoc.getElementsByTagName("object")[i].getAttribute("x"), y: this.xmlDoc.getElementsByTagName("object")[i].getAttribute("y")};
    	var _property = new Array();
    	for(var j = 0; j < this.xmlDoc.getElementsByTagName("object")[i].getElementsByTagName("property").length; j++) {
    		var _n = this.xmlDoc.getElementsByTagName("object")[i].getElementsByTagName("property")[j].getAttribute("name");
    		var _v = this.xmlDoc.getElementsByTagName("object")[i].getElementsByTagName("property")[j].getAttribute("value");
    		_property.push({name: _n, value: _v});
    	}
    	this.sprite.push({object: _s, property: _property});
    }
    
    var interval = setInterval(function(){self.loadResources(interval)}, 100);
    
    return this;
};

Map.prototype.getTilesetId = function(_tileset, _t) {
    for(var i = _tileset.length - 1; i >= 0 ; i--) {
        if(_t >= _tileset[i].firstGid) {
            return i;
        }
    }
    return -1;
};

Map.prototype.createData = function(_i, _layer, _tileset, _t, _tilesetId, _l) {
    if(_tilesetId >= 0) {
        this.t = _t;
        this.t = this.t - _tileset.firstGid;
        this.x = Math.floor(_i % _layer.width) * _tileset.width;
        this.y = Math.floor(_i / _layer.width) * _tileset.height;
        this.frame = {x: this.t * _tileset.width % _tileset.image.width, y: Math.floor(this.t  * _tileset.width / _tileset.image.width) * _tileset.height};
        this.l = _l;
        this.tilesetId = _tilesetId;
        this.twidth = _tileset.width;
        this.theight = _tileset.height;
        this.tvisible = true;
        this.collide = true;
    } else {
        this.t = null;
        this.x = null;
        this.y = null;
        this.frame = {x: null, y: null};
        this.l = _l;
        this.tilesetId = -1;
        this.twidth = null;
        this.theight = null;
        this.tvisible = false;
        this.collide = false;
    }
    return {t: this.t, position: {x: this.x, y: this.y}, frame: this.frame, layer: this.l, tilesetId: this.tilesetId, width: this.twidth, height: this.theight, visible: this.tvisible, collide: this.collide};
};

Map.prototype.createTileset = function(_i) {
	var self = this;
	
    this.firstGid = parseInt(this.xmlDoc.getElementsByTagName("tileset")[_i].getAttribute("firstgid"));
    this.name = this.xmlDoc.getElementsByTagName("tileset")[_i].getAttribute("name");
    this.twidth = parseInt(this.xmlDoc.getElementsByTagName("tileset")[_i].getAttribute("tilewidth"));
    this.theight = parseInt(this.xmlDoc.getElementsByTagName("tileset")[_i].getAttribute("tileheight"));

    this.image = this.game.sprite.loadMap(this.path + this.xmlDoc.getElementsByTagName("image")[_i].getAttribute("source"));
    return {firstGid: this.firstGid, name: this.name, width: this.twidth, height: this.theight, image: this.image};
};

Map.prototype.loadResources = function(_interval) {
	var self = this;
	if(this.game.sprite.isLoaded()) {
		clearInterval(_interval);
	    var counter = 0;            
    	for(var i = 0; i < this.layer.length; i++) {
        	for(var j = 0; j < this.layer[i].width * this.layer[i].height; j++) {
            	var t = parseInt(this.xmlDoc.getElementsByTagName("tile")[counter].getAttribute("gid"));
            	var d = self.getTilesetId(this.tileset, t);
            	this.layer[i].data.push(self.createData(j, this.layer[i], this.tileset[d], t, d, i));
            	counter++;
        	}
        	self.createContext(i);
        }
    }
};

Map.prototype.createContext = function(_i) {
	for(var i = 0; i < this.layer[_i].data.length; i++) {
        var Id = this.layer[_i].data[i].tilesetId;
        if(Id >= 0 && this.layer[_i].data[i].visible) {
            this.context[_i].save();
            this.context[_i].globalAlpha = this.layer[this.layer[_i].data[i].layer].alpha;
            this.context[_i].drawImage(this.tileset[Id].image, this.layer[_i].data[i].frame.x, this.layer[_i].data[i].frame.y, this.tileset[Id].width, this.tileset[Id].height, this.layer[_i].data[i].position.x, this.layer[_i].data[i].position.y, this.tileset[Id].width, this.tileset[Id].height);
            this.context[_i].restore();
        }
    }
};

Map.prototype.createLayer = function(_i) {
    this.name = this.xmlDoc.getElementsByTagName("layer")[_i].getAttribute("name");
    this.width = parseInt(this.xmlDoc.getElementsByTagName("layer")[_i].getAttribute("width"));
    this.height = parseInt(this.xmlDoc.getElementsByTagName("layer")[_i].getAttribute("height"));
    this.alpha = parseFloat(this.xmlDoc.getElementsByTagName("layer")[_i].getAttribute("opacity"));
    if(!this.alpha) {
        this.alpha = 1;
    }
    
    var _scrollable = true;
    var _scroll = {x: 0, y: 0, speed: 1};
    var _position = {x: 0, y: 0};
    var _visible = true;
    var _collidable = false;
    var _main = false;
    
    var l = this.xmlDoc.getElementsByTagName("layer")[_i].getElementsByTagName("property");
    for(var i = 0; i < l.length; i++) {
    	switch(l[i].getAttribute("name")) {
    		case 'scrollable':
    			_scrollable = l[i].getAttribute("value") === 'true' ? true : false;
    			break;
    		case 'scroll.x':
    			_scroll.x = l[i].getAttribute("value");
    			_scroll.x = parseInt(_scroll.x);
    			break;
    		case 'scroll.y':
    			_scroll.y = l[i].getAttribute("value");
    			_scroll.y = parseInt(_scroll.y);
    			break;
    		case 'scroll.speed':
    			_scroll.speed = l[i].getAttribute("value");
    			_scroll.speed = parseFloat(_scroll.speed);
    			break;
    		case 'position.x':
    			_position.x = l[i].getAttribute("value");
    			_position.x = parseInt(_position.x);
    			break;
    		case 'position.y':
    			_position.y = l[i].getAttribute("value");
    			_position.y = parseInt(_position.y);
    			break;
    		case 'visible':
    			_visible = l[i].getAttribute("value") === 'true' ? true : false;
    			break;
    		case 'collidable':
    			_collidable = l[i].getAttribute("value") === 'true' ? true : false;
    			break;
    		case 'main.layer':
    			_main = l[i].getAttribute("value") === 'true' ? true : false;
    	}
    }
    
	this.canvas.push(document.createElement('canvas'));
	this.context.push(this.canvas[_i].getContext('2d'));
    this.canvas[_i].width = this.width * this.tile.width;
    this.canvas[_i].height = this.height * this.tile.height;
    
    return {name: this.name, width: this.width, height: this.height, alpha: this.alpha, tileset: -1, scrollable: _scrollable, scroll: _scroll, position: _position, visible: _visible, collidable: _collidable, main: _main, data: new Array()};
};
    
Map.prototype.getMainLayer = function() {
    for(var i = 0; i < this.layer.length; i++) {
        if(this.layer[i].main) {
            return i;
        }
    }
    return -1;
};

Map.prototype.getLayerIdByName = function(_name) {
    for(var i = 0; i < this.layer.length; i++) {
        if(this.layer[i].name === _name) {
            return i;
        }
    }
    return -1;
};

Map.prototype.getTile = function(_name, _x, _y, _width, _height) {
	_width = _width || 1;
	_height = _height || 1;
	var _layer = this.layer[this.getLayerIdByName(_name)];
	var _tile = (Math.floor(_y / this.tile.height) * _layer.width) + Math.floor(_x / this.tile.width);
	if((_tile >= _layer.data.length || _tile < 0) || (_x > _layer.width * this.tile.width || _x + _width < 0) || (_y > _layer.height * this.tile.height || _y + _height < 0) || (_layer.data[_tile].tilesetId === -1)) {
		return null;
	} else {
		return _tile;
	}
};

Map.prototype.clearTile = function(_name, _x, _y) {
	var _i = this.getLayerIdByName(_name);
	var _layer = this.layer[_i];
	var _tile = this.getTile(_name, _x, _y);
	if(_tile !== null) {
		var _id = _layer.data[_tile].tilesetId;
		_layer.data[_tile].tilesetId = -1;
		this.context[_i].save();
		this.context[_i].globalAlpha = _layer.alpha;
		this.context[_i].clearRect(_layer.data[_tile].position.x, _layer.data[_tile].position.y, this.tileset[_id].width, this.tileset[_id].height);
		this.context[_i].restore();
	}
};

Map.prototype.update = function() {
	for(var i = 0; i < this.layer.length; i++) {
		this.layer[i].position.x += this.layer[i].scroll.x;
		this.layer[i].position.y += this.layer[i].scroll.y;
		this.layer[i].position.x = parseFloat(this.layer[i].position.x.toFixed(3));
		this.layer[i].position.y = parseFloat(this.layer[i].position.y.toFixed(3));
	}
};

Map.prototype.resetScroll = function() {
	for(var i = 0; i < this.layer.length; i++) {
		this.layer[i].scroll.x = 0;
		this.layer[i].scroll.y = 0;
	}
};

Map.prototype.drawLayer = function(_layer) {
	var i = this.findLayer(_layer);
	if(this.layer[i].visible) {
		var w = this.game.canvas.width > this.canvas[i].width ? this.canvas[i].width : this.game.canvas.width;
		var h = this.game.canvas.height > this.canvas[i].height ? this.canvas[i].height : this.game.canvas.height;
		this.game.context.save();
		this.game.context.drawImage(this.canvas[i], Math.round(-this.layer[i].position.x), Math.round(-this.layer[i].position.y), w, h, 0, 0, w, h);
		this.game.context.restore();
	}
};

Map.prototype.draw = function() {
	for(var i = 0; i < this.canvas.length; i++) {
		if(this.layer[i].visible) {
			var w = this.game.canvas.width > this.canvas[i].width ? this.canvas[i].width : this.game.canvas.width;
			var h = this.game.canvas.height > this.canvas[i].height ? this.canvas[i].height : this.game.canvas.height;
			this.game.contextMap.save();
			this.game.contextMap.drawImage(this.canvas[i], Math.round(-this.layer[i].position.x), Math.round(-this.layer[i].position.y), w, h, 0, 0, w, h);
			this.game.contextMap.restore();
		}
	}
};