var Message = function(_font, _game) {
	this.game = _game;
	this.title = null;
	this.x = 0;
	this.y = 0;
	this.align = 'left';
	this.font = _font;
	this.fillStyle = '#FFFFFF';
	this.baseLine = 'top';
	this.strokeStyle = '#FFFFFF';
	this.lineWidth = 0;
	return this;
};

Message.prototype.draw = function() {
	this.game.context.save();
	if(this.font !== null) {
		this.game.context.font = this.font;
	}
	this.game.context.textAlign = this.align;
	this.game.context.textBaseline = this.baseLine;
	this.game.context.fillStyle = this.fillStyle;
	this.game.context.strokeStyle = this.strokeStyle;
	this.game.context.lineWidth = this.lineWidth;
	if(this.lineWidth !== 0)
		this.game.context.strokeText(this.title, this.x, this.y);
	this.game.context.fillText(this.title, this.x, this.y);
	this.game.context.restore();
};