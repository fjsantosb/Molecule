// Sprite var.
function Sprite(_name, _width, _height) {
	this.name = _name;
	this.image = null;
	this.position = {x: 0, y: 0, offset: {x: 0, y: 0}, absolute: {x: 0, y: 0}};
	this.rotation = 0;
	this.move = {x: 0, y: 0};
	this.flip = {x: false, y: false, offset: {x: 0, y: 0}, f: {x: 0, y: 0}};
	this.anchor = {x: 0, y: 0};
	this.visible = true;
	this.alpha = 1;
	this.frame = {width: _width, height: _height, offset: {width: 0, height: 0}};
	this.animation = new Animation(this.frame.width, this.frame.height);
	this.size = {width: 0, height: 0};
	this.collides = {sprite: true, map: true};
	this.scrollable = true;
	this.collidable = true;
	this.platform = false;
	this.acceleration = {x: 0, y: 0};
	this.speed = {x: 0, y: 0, t: {x: 0, y: 0}, max: {x: 100, y: 100}, min: {x: 0, y:0}, check: {x: false, y: false}, gravity: {x: 0, y: 0}};
	this.affects = {physics: {gravity: true, friction: true}};
	this.collision = {map: {up: false, down: false, left: false, right: false, tile: null}, sprite: {up: false, down: false, left: false, right: false, id: null}};
	this.checkCollision = {map: {up: true, down: true, left: true, right: true}};
	this.kill = false;
	this.game = null;
	this.layer = null;
	
	return this;
};

Sprite.prototype.getAnimation = function(_game) {
	this.game = _game;
	this.size = {width: this.image.width, height: this.image.height};
	if(this.frame.width === undefined && this.frame.width === undefined) {
		this.frame.width = this.size.width;
		this.frame.height = this.size.height;
		this.animation = null;
	} else {
		this.animation.sliceFrames(this.image.width, this.image.height, this.frame.width, this.frame.height);
	}
	this.layer = this.game.map.layer[this.game.map.getMainLayer()];
};

// Sprite prototype Method flipUpdate
Sprite.prototype.flipUpdate = function() {
	this.flip.offset.x = this.flip.x ? -this.frame.width : 0;
	this.flip.offset.y = this.flip.y ? -this.frame.height : 0;
	this.flip.f.x = this.flip.x ? -1 : 1;
	this.flip.f.y = this.flip.y ? -1 : 1;
};

// Sprite prototype Method update
Sprite.prototype.update = function() {
	this.position.x += this.move.x;
	this.position.y += this.move.y;
	this.position.x = parseFloat(this.position.x.toFixed(3));
	this.position.y = parseFloat(this.position.y.toFixed(3));
	this.position.absolute.x = this.position.x + this.position.offset.x + this.anchor.x;
	this.position.absolute.y = this.position.y + this.position.offset.y + this.anchor.y;
	if(this.layer !== -1) {
		this.position.absolute.x += Math.abs(this.layer.position.x);
		this.position.absolute.y += Math.abs(this.layer.position.y);
	}
	this.size.width = this.frame.width - this.frame.offset.width;
	this.size.height = this.frame.height - this.frame.offset.height;
};

// Sprite prototype Method resetMove
Sprite.prototype.resetMove = function() {
	this.move = {x: 0, y: 0};
};

// Sprite prototype Method reset acceleration
Sprite.prototype.resetAcceleration = function() {
	this.acceleration = {x: 0, y: 0};
};

// Sprite prototype Method draw
Sprite.prototype.draw = function() {
	this.game.contextSprite.save();
	this.game.contextSprite.globalAlpha = this.alpha;
	this.game.contextSprite.scale(1 * this.flip.f.x, 1 * this.flip.f.y);
	this.game.contextSprite.translate(Math.round((this.position.x * this.flip.f.x) + this.flip.offset.x), Math.round((this.position.y * this.flip.f.y) + this.flip.offset.y));
	this.game.contextSprite.rotate(this.rotation * (Math.PI / 180));
	this.game.contextSprite.translate(Math.round(-this.anchor.x * this.flip.f.x), Math.round(-this.anchor.y * this.flip.f.y));
	if(this.animation !== null)
		this.game.contextSprite.drawImage(this.image, this.animation.frame[this.animation.id[this.animation.current.animation].frame[this.animation.current.frame]].x, this.animation.frame[this.animation.id[this.animation.current.animation].frame[this.animation.current.frame]].y, this.frame.width, this.frame.height, 0, 0, this.frame.width, this.frame.height);
	else
		this.game.contextSprite.drawImage(this.image, 0, 0, this.frame.width, this.frame.height, 0, 0, this.frame.width, this.frame.height);
	this.game.contextSprite.restore();
};

// Sprite prototype Method is_touched
Sprite.prototype.isTouched = function() {
	var _touch = this.game.input.touch;
	for(var i = 0; i < _touch.length; i++)
		if(this.position.x + this.position.offset.x <= _touch[i].x && this.position.x + this.position.offset.x + this.frame.width - this.frame.offset.width - 1 >= _touch[i].x && this.position.y + this.position.offset.y <= _touch[i].y && this.position.y + this.position.offset.y + this.frame.height - this.frame.offset.height - 1 >= _touch[i].y)
			return true;
	return false;
};

// Sprite prototype Method is_clicked
Sprite.prototype.isClicked = function(_button) {
	var _mouse = this.game.input.mouse;
	if(this.position.x + this.position.offset.x <= _mouse.x && this.position.x + this.position.offset.x + this.frame.width - this.frame.offset.width - 1 >= _mouse.x && this.position.y + this.position.offset.y <= _mouse.y && this.position.y + this.position.offset.y + this.frame.height - this.frame.offset.height - 1 >= _mouse.y && _button)
		return true;
	return false;
};

// Sprite prototype Method collidesWithSprite
Sprite.prototype.collidesWithSprite = function(_object) {
	if(((this.position.x - this.anchor.x + this.position.offset.x + this.move.x <= _object.position.x - _object.anchor.x + _object.position.offset.x + _object.move.x && this.position.x - this.anchor.x + this.position.offset.x + this.frame.width - this.frame.offset.width + this.move.x > _object.position.x - _object.anchor.x + _object.position.offset.x + _object.move.x) || (_object.position.x - _object.anchor.x + _object.position.offset.x + _object.move.x <= this.position.x - this.anchor.x + this.position.offset.x + this.move.x && _object.position.x - _object.anchor.x + _object.move.x + _object.position.offset.x + _object.frame.width - _object.frame.offset.width > this.position.x - this.anchor.x + this.position.offset.x + this.move.x)) && ((this.position.y - this.anchor.y + this.position.offset.y + this.move.y <= _object.position.y - _object.anchor.y + _object.position.offset.y + _object.move.y && this.position.y - this.anchor.y + this.position.offset.y + this.frame.height - this.frame.offset.height + this.move.y > _object.position.y - _object.anchor.y + _object.position.offset.y + _object.move.y) || (_object.position.y - _object.anchor.y + _object.position.offset.y + _object.move.y <= this.position.y - this.anchor.y + this.position.offset.y + this.move.y && _object.position.y - _object.anchor.y + _object.move.y + _object.position.offset.y + _object.frame.height - _object.frame.offset.height > this.position.y - this.anchor.y + this.position.offset.y + this.move.y)))
			return true;
	return false;
};

// Sprite prototype Method collidesWithTile
Sprite.prototype.collidesWithTile = function(_layer, _object) {
	var _lpx = Math.abs(_layer.position.x);
	var _lpy = Math.abs(_layer.position.y);
	
	if(((this.position.x - this.anchor.x + this.position.offset.x + this.move.x + _lpx <= _object.position.x && this.position.x - this.anchor.x + this.position.offset.x + this.frame.width - this.frame.offset.width + this.move.x + _lpx > _object.position.x) || (_object.position.x <= this.position.x - this.anchor.x + this.position.offset.x + this.move.x + _lpx && _object.position.x + _object.width > this.position.x - this.anchor.x + this.position.offset.x + this.move.x + _lpx)) && ((this.position.y - this.anchor.y + this.position.offset.y + this.move.y + _lpy <= _object.position.y && this.position.y - this.anchor.y + this.position.offset.y + this.frame.height - this.frame.offset.height + this.move.y + _lpy > _object.position.y) || (_object.position.y <= this.position.y - this.anchor.y + this.position.offset.y + this.move.y + _lpy && _object.position.y + _object.height > this.position.y - this.anchor.y + this.position.offset.y + this.move.y + _lpy)))
			return true;
	return false;
};