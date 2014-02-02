function MapFile(_game) {
	this.game = _game;
	this.tile = new Tile(_game);
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

MapFile.prototype.sprite = function(_sprite, _name) {
	this.game.scene.loadMapSprites(_sprite, _name);
};