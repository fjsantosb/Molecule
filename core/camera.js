Molecule.module('Molecule.Camera', function (require, p) {


// Camera var. Arguments: canvas
    function Camera(_game) {
        this.game = _game;
        this.layer = null;
        this.sprite = null;
        this.scroll = {x: false, y: false};
        this.type = 0;

        return this;
    };

// Method for attach an sprite, map, and main layer
    Camera.prototype.attach = function (_sprite) {
        this.sprite = _sprite;
        this.type = 1;
    };

// Method for detach an sprite
    Camera.prototype.detach = function () {
        this.sprite = null;
        this.type = 0;
    };

    Camera.prototype.set = function () {
        if (this.type === 1) {
            this.layer = this.game.map.getMainLayer();
            this.game.map.resetPosition();
            _x = this.sprite.position.x;
            this.sprite.position.x = 0;
            _y = this.sprite.position.y;
            this.sprite.position.y = 0;
            for (var i = 0; i < _x; i++) {
                this.sprite.move.x = 1;
                this.update(this.game.scene.sprites);
//                this.game.run();
                this.game.resetMove();
            }

            for (var i = 0; i < _y; i++) {
                this.sprite.move.y = 1;
                this.update(this.game.scene.sprites);
//                this.game.run();
                this.game.resetMove();
            }
        }
    };

// Method for update the camera. It will update map & sprite
    Camera.prototype.update = function (_sprite) {
        if (this.game.map !== null && this.layer !== -1) {
            this.makeScroll();
            this.makeMapScroll();
        }
        this.makeSpriteScroll(_sprite, this.sprite.move.x, this.sprite.move.y);
    };

// Method to check if scroll is necessary
    Camera.prototype.makeScroll = function () {
        this.scroll.x = false;
        this.scroll.y = false;
        var wx = this.game.map.canvas[this.layer].width;
        var wy = this.game.map.canvas[this.layer].height;
        if (this.game.map.json.layers[this.layer].properties.scroll.infinite.x) {
            wx = -this.game.map.json.layers[this.layer].x + this.game.canvas.width + 1;
        }
        if (this.game.map.json.layers[this.layer].properties.scroll.infinite.y) {
            wy = -this.game.map.json.layers[this.layer].y + this.game.canvas.height + 1;
        }
        if (this.game.map.json.layers[this.layer].properties.scrollable) {
            if ((-this.game.map.json.layers[this.layer].x + this.game.canvas.width < wx && this.sprite.move.x > 0 && this.sprite.position.x - this.sprite.anchor.x + this.sprite.scroll.offset.x + this.sprite.frame.width / 2 >= this.game.canvas.width / 2) || (-this.game.map.json.layers[this.layer].x > 0 && this.sprite.move.x < 0 && this.sprite.position.x - this.sprite.anchor.x + this.sprite.scroll.offset.x + this.sprite.frame.width / 2 <= this.game.canvas.width / 2)) {
                this.scroll.x = true;
            }
            if ((-this.game.map.json.layers[this.layer].y + this.game.canvas.height < wy && this.sprite.move.y > 0 && this.sprite.position.y - this.sprite.anchor.y + this.sprite.scroll.offset.y + this.sprite.frame.height / 2 >= this.game.canvas.height / 2) || (-this.game.map.json.layers[this.layer].y > 0 && this.sprite.move.y < 0 && this.sprite.position.y - this.sprite.anchor.y + this.sprite.scroll.offset.y + this.sprite.frame.height / 2 <= this.game.canvas.height / 2)) {
                this.scroll.y = true;
            }
        }
    };

// Method to scroll map
    Camera.prototype.makeMapScroll = function () {
        for (var i = 0; i < this.game.map.json.layers.length; i++) {
            if (this.game.map.json.layers[i].type === 'tilelayer' && this.game.map.json.layers[i].properties.scrollable) {
                var wx = this.game.map.canvas[i].width;
                var wy = this.game.map.canvas[i].height;
                if (this.game.map.json.layers[i].properties.scroll.infinite.x) {
                    wx = -this.game.map.json.layers[i].x + this.game.canvas.width + 1;
                }
                if (this.game.map.json.layers[i].properties.scroll.infinite.y) {
                    wy = -this.game.map.json.layers[i].y + this.game.canvas.height + 1;
                }
                if ((-this.game.map.json.layers[i].x + this.game.canvas.width < wx && this.sprite.move.x > 0 && this.sprite.position.x - this.sprite.anchor.x + this.sprite.scroll.offset.x + this.sprite.frame.width / 2 >= this.game.canvas.width / 2) || (-this.game.map.json.layers[i].x > 0 && this.sprite.move.x < 0 && this.sprite.position.x - this.sprite.anchor.x + this.sprite.scroll.offset.x + this.sprite.frame.width / 2 <= this.game.canvas.width / 2)) {
                    if (this.scroll.x) {
                        if (i !== this.layer) {
                            this.game.map.json.layers[i].properties.scroll.x = this.sprite.move.x * -this.game.map.json.layers[i].properties.scroll.speed;
                        } else {
                            this.game.map.json.layers[i].properties.scroll.x = -this.sprite.move.x;
                        }

                    }
                }
                if ((-this.game.map.json.layers[i].y + this.game.canvas.height < wy && this.sprite.move.y > 0 && this.sprite.position.y - this.sprite.anchor.y + this.sprite.scroll.offset.y + this.sprite.frame.height / 2 >= this.game.canvas.height / 2) || (-this.game.map.json.layers[i].y > 0 && this.sprite.move.y < 0 && this.sprite.position.y - this.sprite.anchor.y + this.sprite.scroll.offset.y + this.sprite.frame.height / 2 <= this.game.canvas.height / 2)) {
                    if (this.scroll.y) {
                        if (i !== this.layer) {
                            this.game.map.json.layers[i].properties.scroll.y = this.sprite.move.y * -this.game.map.json.layers[i].properties.scroll.speed;
                        } else {
                            this.game.map.json.layers[i].properties.scroll.y = -this.sprite.move.y;
                        }
                    }
                }
            }
        }
    };

// Method to scroll sprite
    Camera.prototype.makeSpriteScroll = function (_sprite, _x, _y) {
        for (var i = 0; i < _sprite.length; i++) {
            if (_sprite[i].scrollable) {
                if (this.scroll.x) {
                    _sprite[i].move.x = _sprite[i].move.x - _x;
                }
                if (this.scroll.y) {
                    _sprite[i].move.y = _sprite[i].move.y - _y;
                }
            }
        }
    };

    return Camera;

});