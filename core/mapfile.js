function MapFile(_game) {
	this.game = _game;
};

MapFile.prototype.load = function(_name) {
	var m = new Map(this.game);
	m.load(_name);
	return m;
};

MapFile.prototype.set = function(_map) {
	this.game.scene.map = _map;
	this.game.camera.set();
};

MapFile.prototype.getTile = function(_name, _x, _y) {
	var t = this.game.scene.map.getTile(_name, _x, _y);
	return t;
};

MapFile.prototype.clearTile = function(_name, _x, _y) {
	var t = this.game.scene.map.clearTile(_name, _x, _y);
	return t;
};