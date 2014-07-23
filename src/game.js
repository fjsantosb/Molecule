Molecule.module('Molecule.Game', function (require, p) {

    var MapFile = require('Molecule.MapFile'),
        Camera = require('Molecule.Camera'),
        Scene = require('Molecule.Scene'),
        Map = require('Molecule.Map'),
        ImageFile = require('Molecule.ImageFile'),
        AudioFile = require('Molecule.AudioFile'),
        WebAudioFile = require('Molecule.WebAudioFile'),
        Input = require('Molecule.Input'),
        Text = require('Molecule.Text'),
        physics = require('Molecule.Physics'),
        move = require('Molecule.Move'),
        calculateSpriteCollisions = require('Molecule.SpriteCollisions'),
        calculateMapCollisions = require('Molecule.MapCollisions'),
        Sprite = require('Molecule.Sprite'),
        SpriteSheetFile = require('Molecule.SpriteSheetFile'),
        Molecule = require('Molecule.Molecule'),
        utils = require('Molecule.utils');

    p.init = null;

    // Objects defined inline
    // game.object.define('Something', {});
    p.inlineMolecules = {

    };

    p.updateGame = function () {
    };

    p.update = function (_exit, game) {
        var sprite;

        for (var i = 0; i < game.scene.sprites.length; i++) {
            sprite = game.scene.sprites[i];
            sprite.update();
            sprite.flipUpdate();
            if (sprite.animation !== null && _exit)
                sprite.animation.nextFrame();
        }

        if (game.map) {
            game.map.update();
        }


    };

    p.loadResources = function (_interval, game) {
        var total = game.imageFile.data.length + game.mapFile.maps.length + game.audioFile.data.length + game.spriteSheetFile.data.length + game.webAudioFile.data.length;
        var total_loaded = game.imageFile.counter + game.mapFile.getCounter() + game.audioFile.counter + game.spriteSheetFile.getCounter() + game.webAudioFile.counter;
        if (game.imageFile.isLoaded() && game.mapFile.isLoaded() && game.audioFile.isLoaded() && game.spriteSheetFile.isLoaded() && game.webAudioFile.isLoaded()) {
            clearInterval(_interval);
            for (var i = 0; i < game.scene.sprites.length; i++) {
                game.scene.sprites[i].getAnimation();
            }
            p.init();
            p.loop(game);
        }
        game.context.save();
        game.context.fillStyle = '#f8f8f8';
        game.context.fillRect(30, Math.round(game.height / 1.25), (game.width - (30 * 2)), 16);
        game.context.fillStyle = '#ea863a';
        game.context.fillRect(30, Math.round(game.height / 1.25), (game.width - (30 * 2)) * (total_loaded / total), 16);
        game.context.restore();
    };
    
    p.updateSpritesID = function (sprites) {
        for (var i = 0; i < sprites.length; i++) {
            sprites[i].id = i;
        }
    };

    p.removeSprites = function (sprites) {
        for (var i = sprites.length - 1; i >= 0; i--) {
            if (sprites[i].kill) {
                sprites.splice(i, 1);
            }
        }
    };

    p.resetCollisionState = function (sprites) {
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

            sprite.collision.boundaries.id = null;
            sprite.collision.boundaries.left = false;
            sprite.collision.boundaries.right = false;
            sprite.collision.boundaries.up = false;
            sprite.collision.boundaries.down = false;
        }
    };

    p.updateMolecules = function (game) {
        var molecule;
        for (var i = 0; i < game.scene.molecules.length; i++) {
            molecule = game.scene.molecules[i];
            if (molecule.update) molecule.update();
        }
    };
    
    p.updateDrawMolecules = function (game) {
        var molecule;
        for (var i = 0; i < game.scene.molecules.length; i++) {
            molecule = game.scene.molecules[i];
            if (molecule.draw) molecule.draw();
        }
    };

    p.loop = function (game) {
        game.input.checkGamepad();
        p.removeSprites(game.scene.sprites);
        p.updateSpritesID(game.scene.sprites);
        p.updateMolecules(game);
        p.update(null, game);
        if (game.status == 1) {
            var exit = false;
            physics(game);
            p.resetCollisionState(game.scene.sprites);
            while (!exit) {
                exit = move(game.scene.sprites);
                p.checkBoundaries(game);
                calculateMapCollisions(game);
                calculateSpriteCollisions(game);
                p.updateSpriteCollisionCheck(game.scene.sprites);
                if (game.camera.type === 1) {
                    game.camera.update(game.scene.sprites);
                }
                p.update(exit, game);
                game.resetMove();
            }
        }
        p.draw(game);
        p.updateDrawMolecules(game);
        p.updateGame();

        p.requestAnimFrame(function () {
            p.loop(game);
        });
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
            if (game.boundaries.x !== null && sprite.collides.boundaries) {
                if (sprite.position.absolute.x - sprite.anchor.x + sprite.frame.offset.x + sprite.move.x < game.boundaries.x) {
                    sprite.collision.boundaries.left = true;
                    sprite.collision.boundaries.id = 0;
                    sprite.move.x = 0;
                    sprite.speed.x = 0;
                    sprite.speed.t.x = 0;
                    if (game.physics.gravity.x < 0) {
                        sprite.speed.gravity.x = 0;
                    }
                }
                if (sprite.position.absolute.x + sprite.frame.width - sprite.anchor.x - sprite.frame.offset.x + sprite.move.x > game.boundaries.x + game.boundaries.width) {
                    sprite.collision.boundaries.right = true;
                    sprite.collision.boundaries.id = 1;
                    sprite.move.x = 0;
                    sprite.speed.x = 0;
                    sprite.speed.t.x = 0;
                    if (game.physics.gravity.x > 0) {
                        sprite.speed.gravity.x = 0;
                    }
                }
            }
            if (game.boundaries.y !== null && sprite.collides.boundaries) {
                if (sprite.position.absolute.y - sprite.anchor.y + sprite.frame.offset.y + sprite.move.y < game.boundaries.y) {
                    sprite.collision.boundaries.up = true;
                    sprite.collision.boundaries.id = 2;
                    sprite.move.y = 0;
                    sprite.speed.y = 0;
                    sprite.speed.t.y = 0;
                    if (game.physics.gravity.y < 0) {
                        sprite.speed.gravity.y = 0;
                    }
                }
                if (sprite.position.absolute.y + sprite.frame.height - sprite.anchor.y - sprite.frame.offset.y + sprite.move.y > game.boundaries.y + game.boundaries.height) {
                    sprite.collision.boundaries.down = true;
                    sprite.collision.boundaries.id = 3;
                    sprite.move.y = 0;
                    sprite.speed.y = 0;
                    sprite.speed.t.y = 0;
                    if (game.physics.gravity.y > 0) {
                        sprite.speed.gravity.y = 0;
                    }
                }
            }
        }
    };

    p.draw = function (game) {
        var i;

        game.context.clearRect(0, 0, game.width, game.height);
        if (game.map && game.map.visible) {
            game.map.draw(false);
        }
        for (i = 0; i < game.scene.sprites.length; i++) {
            if (game.scene.sprites[i].visible) {
                game.scene.sprites[i].draw(false);
            }
        }
        for (i = 0; i < game.scene.sprites.length; i++) {
            if (game.scene.sprites[i].visible) {
                game.scene.sprites[i].draw(true);
            }
        }
        if (game.map && game.map.visible) {
            game.map.draw(true);
        }
        for (i = 0; i < game.scene.text.length; i++) {
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

    p.propertiesMatch = function (obj, props) {

        var matches = true;

        if (!props) {
            return true;
        }


        for (var prop in props) {
            if (props.hasOwnProperty(prop) && obj[prop] !== props[prop]) {
                matches = false;
            }
        }

        return matches;
    };

    p.timeouts = [];

    var Game = function (options) {

        // PROPERTIES
        this.canvas = null;
        this.context = null;
        this.next = {scene: null, fade: null};
        this.status = 1;
        this.timer = {loop: 60 / 1000, previus: null, now: null, fps: 60, frame: 0};
        this.sounds = {};
        this.sprites = {};
        this.tilemaps = {};
        this.globals = options.globals || {};
        this.node = options.node;

        // OPTIONS
        this.smooth = options.smooth || false;
        this.scale = options.scale || 1;
        this.width = options.width;
        this.height = options.height;

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'canvas');
        this.context = this.canvas.getContext('2d');

        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
                            this.context.mozBackingStorePixelRatio ||
                            this.context.msBackingStorePixelRatio ||
                            this.context.oBackingStorePixelRatio ||
                            this.context.backingStorePixelRatio || 1;
        var ratio = devicePixelRatio / backingStoreRatio;

        // CANVAS

        this.canvas.width = options.width * ratio * this.scale;
        this.canvas.height = options.height * ratio * this.scale;
        
        this.canvas.style.width = (options.width * this.scale) + "px";
        this.canvas.style.height = (options.height * this.scale) + "px";
        
        this.context.scale(ratio * this.scale, ratio * this.scale);
        
        this.context.imageSmoothingEnabled = this.smooth;
        this.context.mozImageSmoothingEnabled = this.smooth;
        this.context.oImageSmoothingEnabled = this.smooth;
        this.context.webkitImageSmoothingEnabled = this.smooth;
        this.context.msImageSmoothingEnabled = this.smooth;

        // GAME COMPONENTS
        this.camera = new Camera(this);
        this.scene = new Scene(this);
        this.map = new Map(this);
        this.input = new Input(this);

        // ASSET LOADING
        this.imageFile = new ImageFile(this);
        this.audioFile = new AudioFile(this);
        this.webAudioFile = new WebAudioFile(this);
        this.mapFile = new MapFile(this);
        this.spriteSheetFile = new SpriteSheetFile(this);

        // GAME SETTINGS
        this.physics = {gravity: {x: 0, y: 0}, friction: {x: 0, y: 0}};
        this.boundaries = {x: null, y: null, width: null, height: null};


        // BINDERS
        utils.bindMethods(this.molecule, this);
        utils.bindMethods(this.sprite, this);
        utils.bindMethods(this.text, this);
        utils.bindMethods(this.tilemap, this);
        utils.bindMethods(this.audio, this);
        utils.bindMethods(this.webaudio, this);

        this.node ? document.getElementById(this.node).appendChild(this.canvas) : document.body.appendChild(this.canvas);

    };

    Game.prototype.audio = {
        create: function (_id) {
            if (utils.isString(_id) && this.sounds[_id]) {
                return this.sounds[_id].clone();
            } else {
                throw new Error('No audio loaded with the name ' + _id);
            }
        }
    };
    
    Game.prototype.webaudio = {
        create: function (_id) {
            if (utils.isString(_id) && this.sounds[_id]) {
                return this.sounds[_id].clone();
            } else {
                throw new Error('No webaudio loaded with the name ' + _id);
            }
        }
    };

    // TODO: Should not be able to add objects more than once
    Game.prototype.add = function (obj) {

        if (arguments.length === 0 || arguments.length > 1 || typeof arguments[0] === 'string') {
            throw new Error('You can only add a single sprite, Molecule Object or text, use respective game.sprite.add, game.object.add and game.text.add');
        }

        if (obj instanceof Molecule) {
            return this.molecule.add(obj);
        }

        if (obj instanceof Sprite) {
            return this.sprite.add(obj)
        }

        if (obj instanceof Text) {
            return this.text.add(obj);
        }

        if (typeof obj === 'function') { // Constructor

            return this.molecule.add(obj);
        }

        throw new Error('You did not pass sprite, Molecule Object or text');

    };

    Game.prototype.get = function () {

        return {
            sprites: this.scene.sprites,
            molecules: this.scene.molecules,
            text: this.scene.text
        };

    };

    Game.prototype.remove = function (obj) {

        if (arguments.length === 0 || arguments.length > 1) {
            throw new Error('You can only remove a single sprite, Molecule Object or text');
        }

        if (obj instanceof Molecule) {
            return this.molecule.remove(obj);
        }

        if (obj instanceof Sprite) {
            return this.sprite.remove(obj)
        }

        if (obj instanceof Text) {
            return this.text.remove(obj);
        }

        throw new Error('You did not pass sprite, Molecule Object or text');

    };

    Game.prototype.is = function (obj, type) {
        return obj._MoleculeType === type;
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
        if (this.map) {
            this.map.resetScroll();
        }

        p.update(null, this);

    };

    Game.prototype.cameraUpdate = function (_exit) {
        for (var i = 0; i < this.scene.sprites.length; i++) {
            this.scene.sprites[i].update();
            this.scene.sprites[i].flipUpdate();
            if (this.scene.sprites[i].animation !== null && _exit)
                this.scene.sprites[i].animation.nextFrame();
        }
        if (this.map !== null)
            this.map.update();
    };

    Game.prototype.start = function () {
        p.start(this);
    };

    Game.prototype.init = function (initializeModules, callback) {
        var self = this,
            object;
        p.init = function () {
            initializeModules();

            // If callback is a string, require a module
            if (utils.isString(callback)) {
                object = require(callback);
            } else {

                // Callback might return an object (using ready method)
                object = callback.call(self.globals, self, require);
            }

            // If we have a Molecule Object constructor, add it to the game
            if (typeof object === 'function') {
                self.add(object);
            }
        }
    };

    Game.prototype.update = function (callback) {
        p.updateGame = callback.bind(this.globals, this, require);
    };

    // All methods are bound to game object
    Game.prototype.molecule = {
        define: function () {
            var name = arguments.length > 1 ? arguments[0] : null,
                options = arguments.length === 1 ? arguments[0] : arguments[1],
                Obj = Molecule.extend.call(Molecule, options);


            // No name means it is coming from a module
            if (!name) {
                return Obj;
            }

            if (!p.inlineMolecules[name]) {
                p.inlineMolecules[name] = Obj;
            } else {
                throw new Error(name + ' already exists as an object');
            }

            return Obj;

        },
        create: function () {
            var name = arguments[0],
                options = arguments[1],
                Obj,
                obj;


            // If passing a constructor
            if (typeof arguments[0] === 'function') {
                return new arguments[0](arguments[1]);
            }

            if (p.inlineMolecules[name]) {
                Obj = p.inlineMolecules[name];
            } else {
                Obj = require(name);
            }

            obj = new Obj(options);
            obj._MoleculeType = name;
            return obj;
        },
        add: function () {

            var obj;

            if (typeof arguments[0] === 'string') {
                obj = this.molecule.create(arguments[0], arguments[1]);
            } else if (utils.isMolecule(arguments[0])) {
                obj = arguments[0];
            } else if (typeof arguments[0] === 'function') { // constructor

                obj = this.molecule.create(arguments[0], arguments[1]);
            } else {
                throw new Error('Wrong parameters, need a string or Molecule Object');
            }

            this.scene.molecules.push(obj);

            if (obj.text) {
                for (var text in obj.text) {
                    if (obj.text.hasOwnProperty(text)) {
                        this.scene.text.push(obj.text[text]);
                    }
                }
            }

            if (obj.sprite) {
                this.scene.sprites.push(obj.sprite);
            } else if (obj.sprites) {
                for (var sprite in obj.sprites) {
                    if (obj.sprites.hasOwnProperty(sprite) && obj.sprites[sprite]) {
                        this.scene.sprites.push(obj.sprites[sprite]);
                    }
                }
            }

            return obj;
        },
        get: function () {

            var options;

            if (!arguments.length) {
                return this.scene.molecules;
            }

            if (typeof arguments[0] === 'string') {

                options = arguments[1] || {};
                options._MoleculeType = arguments[0];

                return utils.find(this.scene.molecules, options);

            } else {
                return utils.find(this.scene.molecules, arguments[0]);
            }

        },
        remove: function () {
            var moleculesToRemove = arguments[0] instanceof Molecule ? [arguments[0]] : this.molecule.get.apply(this, arguments),
                game = this;
            moleculesToRemove.forEach(function (obj) {
                obj.removeListeners();
                if (obj.teardown) {
                  obj.teardown();
                }
                game.scene.molecules.splice(game.scene.molecules.indexOf(obj), 1);
                if (obj.sprite) {
                    game.scene.sprites.splice(game.scene.sprites.indexOf(obj.sprite), 1);
                } else if (obj.sprites) {
                    for (var sprite in obj.sprites) {
                        if (obj.sprites.hasOwnProperty(sprite) && obj.sprites[sprite]) {
                            game.scene.sprites.splice(game.scene.sprites.indexOf(obj.sprites[sprite]), 1);
                        }
                    }
                }
                if (obj.text) {
                    for (var text in obj.text) {
                        if (obj.text.hasOwnProperty(text)) {
                            game.scene.text.splice(game.scene.text.indexOf(obj.text[text]), 1);
                        }
                    }
                }
                if (obj.audio) {
                    for (var audio in obj.audio) {
                        if (obj.audio.hasOwnProperty(audio)) {
                            obj.audio[audio].stop();
                        }
                    }
                }
                if (obj.webaudio) {
                    for (var webaudio in obj.webaudio) {
                        if (obj.webaudio.hasOwnProperty(webaudio)) {
                            obj.webaudio[webaudio].stop();
                        }
                    }
                }
            });
        }
    };

    // All methods are bound to game object
    Game.prototype.sprite = {

        create: function (_id) {
            var loadedSprite,
                sprite;

            if (this.sprites[_id]) {
                loadedSprite = this.sprites[_id];
                sprite = loadedSprite.clone();
            } else {
                throw new Error('Sprite ' + _id + ' does not exist. Has it been loaded?');
            }

            return sprite;
        },
        add: function () {

            var sprite;

            if (typeof arguments[0] === 'string') {
                sprite = this.sprite.create(arguments[0]);
            } else if (utils.isSprite(arguments[0])) {
                sprite = arguments[0];
            } else {
                throw new Error('Wrong parameters, need a string or sprite');
            }

            this.scene.sprites.push(sprite);

            return sprite;
        },
        get: function () {

            var options;

            if (!arguments.length) {
                return this.scene.sprites;
            }

            if (typeof arguments[0] === 'string') {

                options = {
                    name: arguments[0]
                };

                return utils.find(this.scene.sprites, options);

            } else {
                return utils.find(this.scene.sprites, arguments[0]);
            }

        },
        remove: function () {
            var spritesToRemove = arguments[0] instanceof Sprite ? [arguments[0]] : this.sprite.get.apply(this, arguments),
                game = this;
            spritesToRemove.forEach(function (sprite) {
                game.scene.sprites.splice(game.scene.sprites.indexOf(sprite), 1);
            });
        }
    };

    // All methods are bound to game object
    Game.prototype.text = {

        create: function (options) {
            var t = new Text(options, this);
            return t;
        },
        add: function () {

            var text;

            if (utils.isText(arguments[0])) {
                text = arguments[0];
            } else if (utils.isObject(arguments[0])) {
                text = this.text.create(arguments[0]);
            } else {
                throw new Error('Wrong parameters, need a new object or existing Text object');
            }

            this.scene.text.push(text);

            return text;
        },
        get: function () {

            if (!arguments.length) {
                return this.scene.text;
            }

            return utils.find(this.scene.text, arguments[0]);

        },
        remove: function () {
            var textToRemove = arguments[0] instanceof Text ? [arguments[0]] : this.text.get.apply(this, arguments),
                game = this;
            textToRemove.forEach(function (text) {
                game.scene.text.splice(game.scene.text.indexOf(text), 1);
            });
        }

    };

    // All methods are bound to game object
    Game.prototype.tilemap = {

        set: function () {
            var tilemap = this.tilemaps[arguments[0]] || arguments[0],
                self = this;
            if (tilemap && utils.isTilemap(tilemap)) {
                if (this.map && this.map.molecules.length) {
                    this.map.molecules.forEach(function (object) {
                        self.remove(object)
                    });
                }
                this.mapFile.set(tilemap);
            } else {
                throw new Error('There is no tilemap with the name ' + arguments[0] + ' loaded');
            }
        },
        get: function () {
            return this.map;
        },
        remove: function () {
            var self = this;
            if (this.map && this.map.molecules.length) {
                this.map.molecules.forEach(function (object) {
                    self.remove(object)
                });
            }
            this.map = null;
        }

    };

    Game.prototype.trigger = function () {

        var type = arguments[0],
            args = Array.prototype.slice.call(arguments, 0),
            event;

        args.splice(0, 1);

        if (!document.createEvent) {
            event = new CustomEvent(type, { detail: args });
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, true, true, args);
        }

        window.dispatchEvent(event);


    };

    Game.prototype.timeout = function (func, ms, context) {

        var funcString = func.toString();
        var findTimeout = function (funcString) {
            var timeout;
            for (var x = 0; x < p.timeouts.length; x++) {
                timeout = p.timeouts[x];
                if (timeout.funcString === funcString) {
                    return timeout;
                }
            }     
        };
        var timeout = findTimeout(funcString);

        if (!timeout) {
            timeout = {
                funcString: funcString,
                id: setTimeout(function () {
                    p.timeouts.splice(p.timeouts.indexOf(findTimeout(timeout)), 1);
                    func.call(context);
                }, ms),
                clear: function () {
                    clearTimeout(this.id);
                    p.timeouts.splice(p.timeouts.indexOf(findTimeout(timeout)), 1);
                }
            }
            p.timeouts.push(timeout);
            return timeout;
        } else {
            return timeout;
        }

    };


//    Game.prototype.cancelRequestAnimFrame = (function () {
//        return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
//    })();

    return Game;

});