Molecule.module('Molecule.Map', function (require, p) {

    var Sprite = require('Molecule.Sprite');

    function Map(_game) {
        this.game = _game;
        this.canvas = [];
        this.context = [];
        this.name = null;
        this.visible = true;
        this.sprites = [];
        this.objects = [];
        this.image = [];
        this.path = '';
        this.response = null;
        this.json = null;
        this.loaded = false;
    };

    Map.prototype.load = function (_id, _name) {
        this.id = _id;
        this.name = _name;
        var t = _name.split('/');
        for (var i = 0; i < t.length - 1; i++) {
            this.path += t[i] + '/';
        }
        this.ajaxJsonReq(this.name);
        this.game.tilemaps[_id] = this;
    };

    Map.prototype.ajaxJsonReq = function (_name) {
        var self = this;
        var ajaxReq = new XMLHttpRequest();
        ajaxReq.open("GET", _name, true);
        ajaxReq.setRequestHeader("Content-type", "application/json");
        ajaxReq.addEventListener('readystatechange', function () {
            self.jsonLoaded(ajaxReq)
        });
        ajaxReq.send();
    };

    Map.prototype.jsonLoaded = function (_ajaxReq) {
        if (_ajaxReq.readyState == 4 && _ajaxReq.status == 200) {
            this.response = _ajaxReq.responseText;
            this.json = JSON.parse(this.response);
            this.addProperties();
            this.loadImages();

        }
    };

    Map.prototype.reset = function () {
        this.json = null;
        this.json = JSON.parse(this.response);
        this.addProperties();
        this.canvas = [];
        this.context = [];
        this.createContext();
    };

    Map.prototype.loadImages = function () {
        var self = this;
        for (var i = 0; i < this.json.tilesets.length; i++) {
            // Can also load as referenceable sprites
//            Molecule.sprite(this.json.tilesets[i].name, this.json.tilesets[i].image);
//			var image = this.game.imageFile.preload(this.path + this.json.tilesets[i].image);
//            var image = this.game.sprite(this.json.tilesets[i].name).image;
            var image = this.game.imageFile.preload(this.path + this.json.tilesets[i].image);
            this.image.push(image);
        }
        var interval = setInterval(function () {
            self.loadResources(interval)
        }, 100);
    };

    Map.prototype.loadResources = function (_interval) {
        if (this.game.imageFile.isLoaded()) {
            clearInterval(_interval);

            this.loaded = true;
        }
    };

    Map.prototype.addProperties = function () {
        for (var i = 0; i < this.json.layers.length; i++) {
            if (this.json.layers[i].type === 'tilelayer') {
                if (this.json.layers[i].properties !== undefined) {
                    var main = this.json.layers[i].properties['main'] === 'true' ? true : false || false;
                    var scrollable = this.json.layers[i].properties['scrollable'] === 'false' ? false : true || true;
                    var collidable = this.json.layers[i].properties['collidable'] === 'true' ? true : false || false;
                    var overlap = this.json.layers[i].properties['overlap'] === 'true' ? true : false || false;
                    var speed = parseFloat(this.json.layers[i].properties['scroll.speed']).toFixed(3) || 1;
                    var infiniteX = this.json.layers[i].properties['scroll.infinite.x'] === 'true' ? true : false || false;
                    var infiniteY = this.json.layers[i].properties['scroll.infinite.y'] === 'true' ? true : false || false;
                    this.json.layers[i].properties = {scroll: {x: 0, y: 0, speed: speed, infinite: {x: infiniteX, y: infiniteY}}, main: main, scrollable: scrollable, collidable: collidable, overlap: overlap, infinite: {x: infiniteX, y: infiniteY}};
                } else {
                    this.json.layers[i]['properties'] = {scroll: {x: 0, y: 0, speed: 1, infinite: {x: false, y: false}}, main: false, scrollable: true, collidable: false, overlap: false, infinite: {x: false, y: false}};
                }
            }
        }
    };

    Map.prototype.createContext = function () {

        for (var i = 0; i < this.json.layers.length; i++) {
            if (this.json.layers[i].type === 'tilelayer') {
                this.canvas.push(document.createElement('canvas'));
                this.context.push(this.canvas[i].getContext('2d'));
                this.canvas[i].width = (this.json.layers[i].width * this.json.tilewidth);
                this.canvas[i].height = (this.json.layers[i].height * this.json.tileheight);
                for (j = 0; j < this.json.layers[i].data.length; j++) {
                    var data = this.json.layers[i].data[j];
                    if (data > 0) {
                        var tileset = this.getTileset(data);
                        this.context[i].save();
                        this.context[i].globalAlpha = this.json.layers[i].opacity;
                        this.context[i].drawImage(
                            this.image[tileset],
                            Math.floor((data - this.json.tilesets[tileset].firstgid) % (this.json.tilesets[tileset].imagewidth / this.json.tilesets[tileset].tilewidth)) * this.json.tilesets[tileset].tilewidth,
                            Math.floor((data - this.json.tilesets[tileset].firstgid) / (this.json.tilesets[tileset].imagewidth / this.json.tilesets[tileset].tilewidth)) * this.json.tilesets[tileset].tileheight,
                            this.json.tilesets[tileset].tilewidth,
                            this.json.tilesets[tileset].tileheight,
                            (Math.floor(j % this.json.layers[i].width) * this.json.tilesets[tileset].tilewidth),
                            (Math.floor(j / this.json.layers[i].width) * this.json.tilesets[tileset].tileheight),
                            this.json.tilesets[tileset].tilewidth,
                            this.json.tilesets[tileset].tileheight);
                        this.context[i].restore();
                    }
                }
            } else if (this.json.layers[i].type === 'objectgroup') {

                for (j = 0; j < this.json.layers[i].objects.length; j++) {

                    var data = this.json.layers[i].objects[j].gid,
                        tileset = this.getTileset(data),
                        width = this.json.tilesets[tileset].imagewidth,
                        height = this.json.tilesets[tileset].imageheight,
                        frameWidth = this.json.tilesets[tileset].tilewidth,
                        frameHeight = this.json.tilesets[tileset].tileheight,
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        image = new Image(),
                        sprite;

                    canvas.width = width;
                    canvas.height = height;

                    ctx.save();
                    ctx.globalAlpha = this.json.layers[i].opacity;
                    ctx.drawImage(
                        this.image[tileset],
                        0,
                        0,
                        this.json.tilesets[tileset].imagewidth,
                        this.json.tilesets[tileset].imageheight
                    );
                    ctx.restore();

                    image.src = canvas.toDataURL();
                    sprite = new Sprite(this.json.layers[i].name, this.json.layers[i].name, frameWidth, frameHeight);
                    sprite.game = this.game;
                    sprite.image = image;
                    sprite.position.x = this.json.layers[i].objects[j].x;
                    sprite.position.y = this.json.layers[i].objects[j].y - frameHeight; // y offset
                    var object = this.game.object.add(this.json.layers[i].name, {
                        sprite: sprite
                    });
                    this.objects.push(object);

                }


            }
        }
    };

    Map.prototype.getTileset = function (_data) {
        for (var i = 0; i < this.json.tilesets.length; i++) {
            if (this.json.tilesets[i].firstgid > _data) {
                return i - 1;
            } else if (this.json.tilesets.length === 1 || this.json.tilesets.length - 1 === i || this.json.tilesets[i].firstgid === _data) {
                return i;
            }
        }
    };

    Map.prototype.getMainLayer = function () {
        if (this.json !== null) {
            for (var i = 0; i < this.json.layers.length; i++) {
                if (this.game.map.json.layers[i].type === 'tilelayer' && this.json.layers[i].properties.main) {
                    return i;
                }
            }
        }
        return -1;
    };

    Map.prototype.getLayerIdByName = function (_name) {
        for (var i = 0; i < this.json.layers.length; i++) {
            if (this.json.layers[i].name === _name) {
                return i;
            }
        }
        return -1;
    };

    Map.prototype.getTilesetIdByName = function (_name) {
        for (var i = 0; i < this.json.tilesets.length; i++) {
            if (this.json.tilesets[i].name === _name) {
                return i;
            }
        }
        return -1;
    };

    Map.prototype.getTile = function (_name, _x, _y, _width, _height) {
        _width = _width || 0;
        _height = _height || 0;
        var layer = this.getLayerIdByName(_name);
        if (this.json.layers[layer].type === 'tilelayer') {
            if (this.json.layers[layer].properties.scroll.infinite.x && _x >= this.canvas[layer].width / 2) {
                _x = Math.floor(_x % this.canvas[layer].width);
            }
            if (this.json.layers[layer].properties.scroll.infinite.y && _y >= this.canvas[layer].height / 2) {
                _y = Math.floor(_y % this.canvas[layer].height);
            }
            var tile = (Math.floor(_y / this.json.tileheight) * this.json.layers[layer].width) + Math.floor(_x / this.json.tilewidth);
            if ((tile >= this.json.layers[layer].data.length || tile < 0) || (_x > this.json.layers[layer].width * this.json.tilewidth || _x + _width < 0) || (_y > this.json.layers[layer].height * this.json.tileheight || _y + _height < 0)) {
                return null;
            } else {
                return tile;
            }
        } else {
            return null;
        }
    };

    Map.prototype.getTileData = function (_name, _x, _y) {
        var layer = this.getLayerIdByName(_name);
        var tile = this.getTile(_name, _x, _y);
        if (tile === null) {
            return null;
        } else {
            return this.json.layers[layer].data[tile];
        }
    };

    Map.prototype.clearTile = function (_name, _x, _y) {
        var id = this.getLayerIdByName(_name);
        var layer = this.json.layers[id];
        var tile = this.getTile(_name, _x, _y);
        if (tile !== null) {
            layer.data[tile] = 0;
            this.context[id].save();
            this.context[id].globalAlpha = layer.opacity;
            this.context[id].clearRect(Math.floor(tile % this.json.layers[id].width) * this.json.tilewidth, Math.floor(tile / this.json.layers[id].width) * this.json.tilewidth, this.json.tilewidth, this.json.tileheight);
            this.context[id].restore();
        }
    };

    Map.prototype.setTile = function (_name, _x, _y, _tileset, _tile) {
        var id = this.getLayerIdByName(_name);
        var layer = this.json.layers[id];
        var tile = this.getTile(_name, _x, _y);
        var tileset = this.getTilesetIdByName(_tileset);
        var data = _tile + this.json.tilesets[tileset].firstgid;
        if (tile !== null) {
            layer.data[tile] = data;
            this.context[id].save();
            this.context[id].globalAlpha = this.json.layers[id].opacity;
            this.context[id].drawImage(this.image[tileset], Math.floor((data - this.json.tilesets[tileset].firstgid) % this.json.layers[id].width) * this.json.tilesets[tileset].tilewidth, Math.floor((data - this.json.tilesets[tileset].firstgid) / this.json.layers[id].width) * this.json.tilesets[tileset].tilewidth, this.json.tilesets[tileset].tilewidth, this.json.tilesets[tileset].tileheight, Math.floor(tile % this.json.layers[id].width) * this.json.tilewidth, Math.floor(tile / this.json.layers[id].width) * this.json.tilewidth, this.json.tilewidth, this.json.tileheight);
            this.context[id].restore();
        }
    };

    Map.prototype.update = function () {
        if (this.json !== null) {
            for (var i = 0; i < this.json.layers.length; i++) {
                if (this.json.layers[i].type === 'tilelayer') {
                    this.json.layers[i].x += this.json.layers[i].properties.scroll.x;
                    this.json.layers[i].y += this.json.layers[i].properties.scroll.y;
                    this.json.layers[i].x = parseFloat(this.json.layers[i].x.toFixed(3));
                    this.json.layers[i].y = parseFloat(this.json.layers[i].y.toFixed(3));

                    if (this.json.layers[i].properties.scroll.infinite.x && Math.round(this.json.layers[i].x) <= -this.canvas[i].width && this.json.layers[i].properties.scroll.x < 0) {
                        this.json.layers[i].x = 0;
                    } else if (this.json.layers[i].properties.scroll.infinite.x && Math.round(this.json.layers[i].x) >= 0 && this.json.layers[i].properties.scroll.x > 0) {
                        this.json.layers[i].x = -this.canvas[i].width + 1;
                    }
                    if (this.json.layers[i].properties.scroll.infinite.y && Math.round(this.json.layers[i].y) <= -this.canvas[i].height && this.json.layers[i].properties.scroll.y < 0) {
                        this.json.layers[i].y = 0;
                    } else if (this.json.layers[i].properties.scroll.infinite.y && Math.round(this.json.layers[i].y) >= 0 && this.json.layers[i].properties.scroll.y > 0) {
                        this.json.layers[i].y = -this.canvas[i].height + 1;
                    }

                }
            }
        }
    };

    Map.prototype.resetScroll = function () {
        if (this.json !== null) {
            for (var i = 0; i < this.json.layers.length; i++) {
                if (this.json.layers[i].type === 'tilelayer') {
                    this.json.layers[i].properties.scroll.x = 0;
                    this.json.layers[i].properties.scroll.y = 0;
                }
            }
        }
    };

    Map.prototype.resetPosition = function () {
        for (var i = 0; i < this.json.layers.length; i++) {
            if (this.json.layers[i].type === 'tilelayer') {
                this.json.layers[i].x = 0;
                this.json.layers[i].y = 0;
            }
        }
    };

    Map.prototype.draw = function (_overlap) {
        for (var i = 0; i < this.canvas.length; i++) {
            if (this.json.layers[i].type === 'tilelayer' && this.json.layers[i].visible && this.json.layers[i].properties.overlap === _overlap) {
                var w = this.game.canvas.width > this.canvas[i].width ? this.canvas[i].width : this.game.canvas.width;
                var h = this.game.canvas.height > this.canvas[i].height ? this.canvas[i].height : this.game.canvas.height;
                var w1x = 0;
                var w1y = 0;
                if (this.json.layers[i].properties.scroll.infinite.x && Math.floor(-this.json.layers[i].x) + w > this.canvas[i].width) {
                    w1x = Math.floor(-this.json.layers[i].x) + w - this.canvas[i].width;
                }
                if (this.json.layers[i].properties.scroll.infinite.y && Math.floor(-this.json.layers[i].y) + h > this.canvas[i].height) {
                    w1y = Math.floor(-this.json.layers[i].y) + h - this.canvas[i].height;
                }
                this.game.context.save();
                this.game.context.drawImage(this.canvas[i], Math.floor(-this.json.layers[i].x), Math.floor(-this.json.layers[i].y), w - w1x, h - w1y, 0, 0, w - w1x, h - w1y);
                this.game.context.restore();
                if (this.json.layers[i].properties.scroll.infinite.x) {
                    if (w1x > 0) {
                        this.game.context.save();
                        this.game.context.drawImage(this.canvas[i], 0, 0, w1x, h, w - w1x, 0, w1x, h);
                        this.game.context.restore();
                    }
                }
                if (this.json.layers[i].properties.scroll.infinite.y) {
                    if (w1y > 0) {
                        this.game.context.save();
                        this.game.context.drawImage(this.canvas[i], 0, 0, w, w1y, 0, h - w1y, w, w1y);
                        this.game.context.restore();
                    }
                }
                if (this.json.layers[i].properties.scroll.infinite.x && this.json.layers[i].properties.scroll.infinite.y) {
                    if (w1x > 0 && w1y > 0) {
                        this.game.context.save();
                        this.game.context.drawImage(this.canvas[i], 0, 0, w1x, w1y, w - w1x, h - w1y, w1x, w1y);
                        this.game.context.restore();
                    }
                }
            }
        }
    };

    return Map;

});