Molecule.module('Molecule.Sprite', function (require, p) {

    var Animation = require('Molecule.Animation'),
        utils = require('Molecule.utils');

	// Sprite var.
    function Sprite(_name, _src, _width, _height) {

        this.name = _name;
        this.src = _src;
        this.image = null;
        this.position = {x: 0, y: 0, absolute: {x: 0, y: 0}};
        this.rotation = 0;
        this.move = {x: 0, y: 0};
        this.flip = {x: false, y: false, offset: {x: 0, y: 0}, f: {x: 0, y: 0}};
        this.anchor = {x: 0, y: 0};
        this.visible = true;
        this.alpha = 1;
        this.frame = {width: _width, height: _height, offset: {x: 0, y: 0, width: 0, height: 0}};
        this.animation = new Animation(this.frame.width, this.frame.height);
        this.size = {width: 0, height: 0};
        this.collides = {sprite: true, map: true, boundaries: true, group: null};
        this.scrollable = true;
        this.collidable = true;
        this.platform = false;
        this.bounciness = false;
        this.acceleration = {x: 0, y: 0};
        this.speed = {x: 0, y: 0, t: {x: 0, y: 0}, max: {x: 100, y: 100}, min: {x: 0, y: 0}, check: {x: false, y: false}, gravity: {x: 0, y: 0}};
        this.affects = {physics: {gravity: true, friction: true}};
        this.collision = {map: {up: false, down: false, left: false, right: false, tile: null}, sprite: {up: false, down: false, left: false, right: false, id: null}, boundaries: {up: false, down: false, left: false, right: false, id: false}, check: {map: {up: true, down: true, left: true, right: true}}};
        this.overlap = false;
        this.kill = false;
        this.game = null;
        this.width = 0;
        this.height = 0;

        return this;
    };

    Sprite.prototype.getAnimation = function () {
        this.size = {width: this.image.width, height: this.image.height};
        this.frame.width = this.frame.width || this.size.width;
        this.frame.height = this.frame.height || this.size.height;
        this.width = this.frame.width;
        this.height = this.frame.height;
        this.animation.sliceFrames(this.image.width, this.image.height, this.frame.width, this.frame.height);
    };

	// Sprite prototype Method flipUpdate
    Sprite.prototype.flipUpdate = function () {
        this.flip.offset.x = this.flip.x ? -this.frame.width : 0;
        this.flip.offset.y = this.flip.y ? -this.frame.height : 0;
        this.flip.f.x = this.flip.x ? -1 : 1;
        this.flip.f.y = this.flip.y ? -1 : 1;
    };

	// Sprite prototype Method update
    Sprite.prototype.update = function () {
        this.position.x += this.move.x;
        this.position.y += this.move.y;
        this.position.x = parseFloat(this.position.x.toFixed(3));
        this.position.y = parseFloat(this.position.y.toFixed(3));
        this.position.absolute.x = this.position.x;
        this.position.absolute.y = this.position.y;
        if (this.game.map.getMainLayer() !== -1) {
            this.position.absolute.x += Math.abs(this.game.map.json.layers[this.game.map.getMainLayer()].x);
            this.position.absolute.y += Math.abs(this.game.map.json.layers[this.game.map.getMainLayer()].y);
        }
    };

	// Sprite prototype Method resetMove
    Sprite.prototype.resetMove = function () {
        this.move = {x: 0, y: 0};
    };

	// Sprite prototype Method reset acceleration
    Sprite.prototype.resetAcceleration = function () {
        this.acceleration = {x: 0, y: 0};
    };

	// Sprite prototype Method draw
    Sprite.prototype.draw = function (_overlap) {
        if (this.overlap === _overlap && this.position.x - this.anchor.x + this.frame.width >= 0 && this.position.y - this.anchor.y + this.frame.height >= 0 && this.position.x - this.anchor.x <= this.game.width && this.position.y - this.anchor.y <= this.game.height) {
            this.game.context.save();
            this.game.context.globalAlpha = this.alpha;
            this.game.context.scale(1 * this.flip.f.x, 1 * this.flip.f.y);
            this.game.context.translate(Math.round((this.position.x * this.flip.f.x) + this.flip.offset.x), Math.round((this.position.y * this.flip.f.y) + this.flip.offset.y));
            this.game.context.rotate(this.rotation * (Math.PI / 180));
            this.game.context.translate(Math.round(-this.anchor.x * this.flip.f.x), Math.round(-this.anchor.y * this.flip.f.y));
            this.game.context.drawImage(this.image, this.animation.frame[this.animation.id[this.animation.current.animation].frame[this.animation.current.frame]].x, this.animation.frame[this.animation.id[this.animation.current.animation].frame[this.animation.current.frame]].y, this.frame.width, this.frame.height, 0, 0, this.frame.width, this.frame.height);
            this.game.context.restore();
        }
    };

	// Sprite prototype Method is_touched
    Sprite.prototype.touch = function () {
        var _touch = this.game.input.touch;
        for (var i = 0; i < _touch.length; i++) {
            if (this.position.x - this.anchor.x + this.frame.offset.x <= _touch[i].x && this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x > _touch[i].x && this.position.y - this.anchor.y + this.frame.offset.y <= _touch[i].y && this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y > _touch[i].y) {
                return true;
            }
        }
        return false;
    };

	// Sprite prototype Method is_clicked
    Sprite.prototype.click = function (_button) {
        var _mouse = this.game.input.mouse;
        if (this.position.x - this.anchor.x + this.frame.offset.x <= _mouse.x && this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x > _mouse.x && this.position.y - this.anchor.y + this.frame.offset.y <= _mouse.y && this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y > _mouse.y && _button)
            return true;
        return false;
    };

	// Sprite prototype Method collidesWithSprite
    Sprite.prototype.collidesWithSprite = function (_object) {
        if (((this.position.x - this.anchor.x + this.move.x + this.frame.offset.x <= _object.position.x - _object.anchor.x + _object.move.x + _object.frame.offset.x && this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x + this.move.x > _object.position.x - _object.anchor.x + _object.move.x + _object.frame.offset.x) || (_object.position.x - _object.anchor.x + _object.move.x + _object.frame.offset.x <= this.position.x - this.anchor.x + this.move.x + this.frame.offset.x && _object.position.x - _object.anchor.x + _object.move.x + _object.frame.width - _object.frame.offset.x > this.position.x - this.anchor.x + this.move.x + this.frame.offset.x)) && ((this.position.y - this.anchor.y + this.move.y + this.frame.offset.y <= _object.position.y - _object.anchor.y + _object.move.y + _object.frame.offset.y && this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y + this.move.y > _object.position.y - _object.anchor.y + _object.move.y + _object.frame.offset.y) || (_object.position.y - _object.anchor.y + _object.move.y + _object.frame.offset.y <= this.position.y - this.anchor.y + this.move.y + this.frame.offset.y && _object.position.y - _object.anchor.y + _object.move.y + _object.frame.height - _object.frame.offset.y > this.position.y - this.anchor.y + this.move.y + this.frame.offset.y)))
            return true;
        return false;
    };

	// Sprite prototype Method collidesWithTile
    Sprite.prototype.collidesWithTile = function (_layer, _tile, _j) {

        var _lpx = Math.abs(_layer.x);
        var _lpy = Math.abs(_layer.y);

        _object = {position: {
            x: Math.floor(_tile % _layer.width) * this.game.map.json.tilewidth,
            y: Math.floor(_tile / _layer.width) * this.game.map.json.tileheight},
            width: this.game.map.json.tilesets[this.game.map.getTileset(_layer.data[_tile])].tilewidth,
            height: this.game.map.json.tilesets[this.game.map.getTileset(_layer.data[_tile])].tileheight};

        var px1 = this.position.x - this.anchor.x + this.move.x + this.frame.offset.x + _lpx;
        var px2 = this.position.x - this.anchor.x + this.frame.width - this.frame.offset.x + this.move.x + _lpx;
        var px3 = this.position.x - this.anchor.x + this.move.x + this.frame.offset.x + _lpx;
        var px4 = this.position.x - this.anchor.x + this.move.x + this.frame.offset.x + _lpx;
        if (_layer.properties.scroll.infinite.x) {
            if (px1 >= this.game.map.canvas[_j].width) {
                px1 = Math.floor(px1 % this.game.map.canvas[_j].width);
            }
            if (px2 >= this.game.map.canvas[_j].width) {
                px2 = Math.floor(px2 % this.game.map.canvas[_j].width);
            }
            if (px3 >= this.game.map.canvas[_j].width) {
                px3 = Math.floor(px3 % this.game.map.canvas[_j].width);
            }
            if (px4 >= this.game.map.canvas[_j].width) {
                px4 = Math.floor(px4 % this.game.map.canvas[_j].width);
            }
        }

        var py1 = this.position.y - this.anchor.y + this.move.y + this.frame.offset.y + _lpy;
        var py2 = this.position.y - this.anchor.y + this.frame.height - this.frame.offset.y + this.move.y + _lpy;
        var py3 = this.position.y - this.anchor.y + this.move.y + this.frame.offset.y + _lpy;
        var py4 = this.position.y - this.anchor.y + this.move.y + this.frame.offset.y + _lpy;
        if (_layer.properties.scroll.infinite.y) {
            if (py1 >= this.game.map.canvas[_j].height) {
                py1 = Math.floor(py1 % this.game.map.canvas[_j].height);
            }
            if (py2 >= this.game.map.canvas[_j].height) {
                py2 = Math.floor(py2 % this.game.map.canvas[_j].height);
            }
            if (py3 >= this.game.map.canvas[_j].height) {
                py3 = Math.floor(py3 % this.game.map.canvas[_j].height);
            }
            if (py4 >= this.game.map.canvas[_j].height) {
                py4 = Math.floor(py4 % this.game.map.canvas[_j].height);
            }
        }

        if (((px1 <= _object.position.x && px2 > _object.position.x) || (_object.position.x <= px3 && _object.position.x + _object.width > px4)) && ((py1 <= _object.position.y && py2 > _object.position.y) || (_object.position.y <= py3 && _object.position.y + _object.height > py4)))
            return true;
        return false;
    };

    Sprite.prototype.clone = function () {
        var sprite = new Sprite(this.name, this.src, this.frame.width, this.frame.height);
        sprite.image = this.image;
        sprite.game = this.game;

        utils.deepClone(this, sprite, [
            'name',
            'src',
            '_MoleculeType',
            'position',
            'rotation',
            'move',
            'flip',
            'anchor',
            'visible',
            'alpha',
            'frame',
            'size',
            'collides',
            'scrollable',
            'collidable',
            'platform',
            'bounciness',
            'acceleration',
            'speed',
            'affects',
            'collision',
            'overlap',
            'kill'
        ]);

        sprite.getAnimation();
        if (this.frame.width && this.frame.height) {
            sprite.animation.add('idle');
        }

        return sprite;
    }

    return Sprite;

});