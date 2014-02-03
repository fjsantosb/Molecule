function Tile(_game) {
	this.game = _game;
};

Tile.prototype.get = function(_name, _x, _y) {
	var t = this.game.map.getTileId(_name, _x, _y);
	return t;
};

Tile.prototype.set = function(_name, _x, _y, _tile) {
	this.game.map.setTile(_name, _x, _y, _tile);
};

Tile.prototype.clear = function(_name, _x, _y) {
	var t = this.game.map.clearTile(_name, _x, _y);
	return t;
};