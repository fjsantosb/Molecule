Molecule.module('Molecule.Text', function (require, p) {

	function Text (_font, _x, _y, _title, _game) {
		this.game = _game;
		this.title = _title === undefined ? null : _title;
		this.x = _x || 0;
		this.y = _y || 0;
		this.align = 'left';
		this.font = _font;
		this.color = '#FFFFFF';
		this.baseline = 'top';
		this.alpha = 1;
		this.visible = true;
		this.stroke = {enable: false, color: '#000000'};
	};

	Text.prototype.draw = function() {
		this.game.context.save();
		if(this.font !== null) {
			this.game.context.font = this.font;
		}
		this.game.context.globalAlpha = this.alpha;
		this.game.context.textAlign = this.align;
		this.game.context.textBaseline = this.baseline;
		this.game.context.fillStyle = this.color;
		this.game.context.fillText(this.title, this.x, this.y);
		if(this.stroke.enable) {
			this.game.context.strokeStyle = this.stroke.color;
			this.game.context.strokeText(this.title, this.x, this.y);
		}
		this.game.context.restore();
	};

	Text.prototype.measure = function() {
		return this.game.context.measureText(this.title).width;
	};

	return Text;

});
