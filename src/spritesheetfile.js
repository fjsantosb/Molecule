Molecule.module('Molecule.SpriteSheetFile', function (require, p) {

    var SpriteSheet = require('Molecule.SpriteSheet');
    
    function SpriteSheetFile(_game) {
        this.game = _game;
        this.data = [];
    }
    
    SpriteSheetFile.prototype.load = function(_file, _sprites) {
        var s = new SpriteSheet(this.game);
        s.load(_file, _sprites);
        this.data.push(s);
    };
    
    SpriteSheetFile.prototype.isLoaded = function() {
        var loaded = true;
        var i;
        for(i = 0; i < this.data.length; i++) {
            if(!this.data[i].loaded) {
                loaded = false;
            }
        }
        return loaded;
    };
    
    SpriteSheetFile.prototype.getCounter = function() {
        var c = 0;
        var i;
        for(i = 0; i < this.data.length; i++) {
            if(this.data[i].loaded) {
                c++;
            }
        }
        return c;
    };

    return SpriteSheetFile;
});