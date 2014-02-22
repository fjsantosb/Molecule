Molecule.module('Molecule.Game', function (require, p) {

    var MapFile = require('Molecule.MapFile'),
        Camera = require('Molecule.Camera'),
        Scene = require('Molecule.Scene'),
        Map = require('Molecule.Map'),
        ImageFile = require('Molecule.ImageFile'),
        AudioFile = require('Molecule.AudioFile'),
        Input = require('Molecule.Input'),
        Text = require('Molecule.Text'),
        physics = require('Molecule.Game.physics'),
        move = require('Molecule.Game.move'),
        calculateSpriteCollisions = require('Molecule.Game.calculateSpriteCollisions'),
        calculateMapCollisions = require('Molecule.Game.calculateMapCollisions');

    p.init = null;
    p.run = null;
    p.update = function (_exit, game) {
        var sprite;
        for (var i = 0; i < game.scene.sprites.length; i++) {
            sprite = game.scene.sprites[i];
            sprite.update();
            sprite.flipUpdate();
            if (sprite.animation !== null && _exit)
                sprite.animation.nextFrame();
        }
        if (game.map !== null)
            game.map.update();

    };

    p.loadResources = function (_interval, game) {
        if (game.sprite.isLoaded() && game.tilemap.isLoaded()) {
            clearInterval(_interval);
            for (var i = 0; i < game.scene.sprites.length; i++) {
                game.scene.sprites[i].getAnimation();
            }
            p.init();
            game.camera.set();
            p.loop(game);
        }
    };

    p.removeSprites = function (sprites) {
        for (var i = sprites.length - 1; i >= 0; i--) {
            if (sprites[i].kill) {
                sprites.splice(i, 1);
            }
        }
    };

    p.updateCollisionState = function (sprites) {
        var sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            sprite.collision.sprite.id = null;
            sprite.collision.sprite.left = false;
            sprite.collision.sprite.right = false;
            sprite.collision.sprite.up = false;
            sprite.collision.sprite.down = false;

            sprite.collision.map.tile = null;
            sprite.collision.map.left = false;
            sprite.collision.map.right = false;
            sprite.collision.map.up = false;
            sprite.collision.map.down = false;
        }
    };

    p.loop = function (game) {

        p.requestAnimFrame(function () {
            p.loop(game);
        });
        p.removeSprites(game.scene.sprites);
        p.update(null, game);
        if (game.status == 1) {
            var exit = false;
            physics(game);
            p.updateCollisionState(game.scene.sprites);
            while (!exit) {
                exit = move(game.scene.sprites);
                calculateMapCollisions(game);
                calculateSpriteCollisions(game);
                p.updateSpriteCollisionCheck(game.scene.sprites);
                if (game.camera.type === 1) {
                    game.camera.update(game.scene.sprites);
                }
                p.update(exit, game);
                p.checkBoundaries(game);
                game.resetMove();
            }
        }
        p.draw(game);
        p.run();

    };

    p.updateSpriteCollisionCheck = function (sprites) {
        var sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            if (sprite.speed.check.x && sprite.speed.check.y) {
                sprite.resetMove();
            }
        }
    };

    p.checkBoundaries = function (game) {
        var sprite;
        for (var i = 0; i < game.scene.sprites.length; i++) {
            sprite = game.scene.sprites[i];
            if (game.boundaries.x !== null) {
                if (sprite.position.x - sprite.anchor.x < game.boundaries.x) {
                    sprite.position.x = game.boundaries.x + sprite.anchor.x;
                }
                if (sprite.position.x + sprite.frame.width - sprite.anchor.x > game.boundaries.x + game.boundaries.width) {
                    sprite.position.x = game.boundaries.x + game.boundaries.width - sprite.frame.width + sprite.anchor.x;
                }
            }
            if (game.boundaries.y !== null) {
                if (sprite.position.y - sprite.anchor.y < game.boundaries.y) {
                    sprite.position.y = game.boundaries.y + sprite.anchor.y;
                }
                if (sprite.position.y + sprite.frame.height - sprite.anchor.y > game.boundaries.y + game.boundaries.height) {
                    sprite.position.y = game.boundaries.y + game.boundaries.height - sprite.frame.height + sprite.anchor.y;
                }
            }
        }

    };

    p.draw = function (game) {

        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        if (game.map !== null && game.map.visible) {
            game.map.draw(false);
        }
        for (var i = 0; i < game.scene.sprites.length; i++) {
            if (game.scene.sprites[i].visible) {
                game.scene.sprites[i].draw(false);
            }
        }
        for (var i = 0; i < game.scene.sprites.length; i++) {
            if (game.scene.sprites[i].visible) {
                game.scene.sprites[i].draw(true);
            }
        }
        if (game.map !== null && game.map.visible) {
            game.map.draw(true);
        }
        for (var i = 0; i < game.scene.text.length; i++) {
            if (game.scene.text[i].visible) {
                game.scene.text[i].draw();
            }
        }

    };

    p.requestAnimFrame = (function () {
        var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60)
        };
        return requestAnimFrame.bind(window);
    })();

    p.start = function (game) {
        var interval = setInterval(function () {
            p.loadResources(interval, game);
        }, 100);
    };

    var Game = function (_width, _height, _scale) {

        this.canvas = null;
        this.context = null;
        this.scale = _scale || 1;
        this.physics = {gravity: {x: 0, y: 0}, friction: {x: 0, y: 0}};
        this.boundaries = {x: null, y: null, width: null, height: null};
        this.tilemap = new MapFile(this);
        this.camera = new Camera(this);
        this.scene = new Scene(this);
        this.map = new Map(this);
        this.next = {scene: null, fade: null};
        this.sprite = new ImageFile(this);
        this.audio = new AudioFile(this);
        this.sound = new Array();
        this.input = new Input(this);
        this.status = 1;
        this.timer = {loop: 60 / 1000, previus: null, now: null, fps: 60, frame: 0};
        this.width = _width;
        this.height = _height;

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'canvas');

        this.canvas.width = _width;
        this.canvas.height = _height;

        this.canvas.style.width = _width * this.scale + "px";
        this.canvas.style.height = _height * this.scale + "px";
        this.context = this.canvas.getContext('2d');

        document.body.appendChild(this.canvas);
    };

    Game.prototype.init = function (callback) {
        p.start(this);
        callback();
    };

    Game.prototype.init = function (callback) {
        p.init = callback;
        p.start(this);
        delete this.init;
    };

    Game.prototype.update = function (callback) {
        p.run = callback;
    };

    Game.prototype.text = function (_font) {
        var t = new Text(_font, this);
        this.scene.text.push(t);
        return t;
    };

// Not in use, remove?
    Game.prototype.updateTimer = function () {
        this.timer.frame++;
        this.timer.now = new Date().getTime();
        if (this.timer.previus !== null)
            this.timer.loop = (this.timer.now - this.timer.previus) / 1000;
        if (this.timer.now - this.timer.previus >= 1000) {
            this.timer.previus = this.timer.now;
            this.timer.fps = this.timer.frame;
            this.timer.frame = 0;
        }
    };

    Game.prototype.play = function () {
        this.status = 1;
    };

    Game.prototype.stop = function () {
        this.status = 0;
    };

    Game.prototype.resetMove = function () {

        for (var i = 0; i < this.scene.sprites.length; i++) {
            this.scene.sprites[i].resetMove();
        }
        if (this.map !== null) {
            this.map.resetScroll();
        }

        p.update(null, this);

    };

    Game.prototype.run = function () {
        console.log('running');
        p.run();
    }


//    Game.prototype.cancelRequestAnimFrame = (function () {
//        return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
//    })();

    return Game;

});