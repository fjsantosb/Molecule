function MapFile(_game) {
	this.game = _game;
};

MapFile.prototype.load = function(_name) {
	var m = new Map(this.game);
	m.load(_name);
	return m;
};

MapFile.prototype.set = function(_map) {
	this.game.map = _map;
	this.game.scene.map = _map;
	this.game.setCamera();
};