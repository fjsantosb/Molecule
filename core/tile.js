function Tile(_game) {
	this.game = _game;
};

Tile.prototype.get = function(_name, _x, _y) {
	var t = this.game.scene.map.getTileId(_name, _x, _y);
	return t;
};

Tile.prototype.clear = function(_name, _x, _y) {
	var t = this.game.scene.map.clearTile(_name, _x, _y);
	return t;
};