Molecule.module('Molecule.SpriteSheet', function (require, p) {

    var sprite = require('Molecule.Sprite');

    function SpriteSheet(_game) {
        this.game = _game;
        this.sprites = null;
        this.image = null;
        this.response = null;
        this.json = null;
        this.path = '';
    }
    
    SpriteSheet.prototype.load = function(_file, _sprites) {
        var self = this;
        var ajaxReq = new XMLHttpRequest();
        var t = _file.split('/');
        var i;
        
        this.sprites = _sprites;
                
        for (i = 0; i < t.length - 1; i++) {
            this.path += t[i] + '/';
        }
        ajaxReq.open("GET", _file, true);
        ajaxReq.setRequestHeader("Content-type", "application/json");
        ajaxReq.addEventListener('readystatechange', function () {
            self.jsonLoaded(ajaxReq)
        });
        ajaxReq.send();
    };
    
    SpriteSheet.prototype.jsonLoaded = function (_ajaxReq) {
        if (_ajaxReq.readyState == 4 && _ajaxReq.status == 200) {
            this.response = _ajaxReq.responseText;
            this.json = JSON.parse(this.response);
            this.loadImage();

        }
    };
    
    SpriteSheet.prototype.loadImage = function() {
        var self = this;
        this.image = this.game.imageFile.preload(this.path + this.json.meta.image);
        var interval = setInterval(function () {
            self.loadSprites(interval)
        }, 100);
    };
    
    SpriteSheet.prototype.loadSprites = function(_interval) {
        var i;
        var j;
        var f;
        if (this.game.imageFile.isLoaded()) {
            clearInterval(_interval);
            for (p in this.sprites) {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var image = new Image();
                var sizeW = 0;
                var sizeH = 0;
                f = false;
                for(i = 0; i < this.sprites[p].length; i++) {
                    for(j = 0; j < this.json.frames.length; j++) {
                        if(this.sprites[p][i] === this.json.frames[j].name) {
                            if(!f) {
                                sizeW = this.json.frames[j].size.w;
                                sizeH = this.json.frames[j].size.h;
                                canvas.width = this.json.frames[j].size.w * this.sprites[p].length;
                                canvas.height = this.json.frames[j].size.h;
                                f = true;
                            }
                            context.drawImage(this.image, this.json.frames[j].position.x, this.json.frames[j].position.y, this.json.frames[j].size.w, this.json.frames[j].size.h, this.json.frames[j].size.w * i, 0, this.json.frames[j].size.w, this.json.frames[j].size.h);
                        }
                    }
                }
                image.src = canvas.toDataURL("image/png");
                var s = this.game.imageFile.loadSpriteSheet(p, image, sizeW, sizeH);
            }
        }
    };
    
    return SpriteSheet;
});