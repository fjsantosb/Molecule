var Message = function(_title, _x, _y, _game) {
	this.game = _game;
	this.title = _title;
	this.x = _x || 0;
	this.y = _y || 0;
	this.align = 'left';
	this.font = null;
	this.fillStyle = '#FFFFFF';
	this.baseline = 'top';
	return this;
};

Message.prototype.draw = function() {
	this.game.context.save();
	if(this.font !== null)
		this.game.context.font = this.font;
	this.game.context.textBaseline = this.baseline;
	this.game.context.fillStyle = this.fillStyle;
	this.game.context.textAlign = this.align;
	this.game.context.fillText(this.title, this.x, this.y);
	this.game.context.restore();
};