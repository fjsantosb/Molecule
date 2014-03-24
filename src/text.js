Molecule.module('Molecule.Text', function (require, p) {

    var utils = require('Molecule.utils');

	function Text (options, _game) {
		this.game = _game;
		this.title = '';
        this.position = options.position || {x:0,y:0};
		this.align = 'left';
		this.font = 'Arial 16px';
		this.color = '#FFFFFF';
		this.baseline = 'top';
		this.alpha = 1;
		this.visible = true;
		this.stroke = null;
		this.lineWidth = 1;
        utils.mergeSafely(options, this, ['game']);
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
		this.game.context.fillText(this.title, this.position.x, this.position.y);
		if(this.stroke) {
		    this.game.context.lineWidth = this.lineWidth;
			this.game.context.strokeStyle = this.stroke;
			this.game.context.strokeText(this.title, this.position.x, this.position.y);
		}
		this.game.context.restore();
	};

	Text.prototype.measure = function() {
		return this.game.context.measureText(this.title).width;
	};

    Text.prototype.clone = function () {
        var options = utils.deepClone(this, {}, [
            'title',
            'position',
            'align',
            'font',
            'color',
            'baseline',
            'alpha',
            'visible',
            'stroke',
            'lineWidth'
        ]);
        var text = new Text(options, this.game);
        return text;
    };

	return Text;

});
