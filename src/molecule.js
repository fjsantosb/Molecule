Molecule.module('Molecule.Molecule', function (require, p) {

    var Text = require('Molecule.Text');
    var utils = require('Molecule.utils');
    
    p.isInstanceOfMoleculeObject = function (value) {
        
        return utils.isMolecule(value) || utils.isSprite(value) || utils.isText(value) || utils.isTilemap(value);
        
    };
    
    p.cloneOptions = function (source) {

        var target = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {

                if (source[prop] instanceof Array) {
                    target[prop] = source[prop].slice(0);
                } else if (typeof source[prop] === 'object' && source[prop] !== null && !p.isInstanceOfMoleculeObject(source[prop])) {
                    target[prop] = this.cloneOptions(source[prop]);
                } else {
                    target[prop] = source[prop];
                }

            }
        }

        return target;
    }

    p.mergeObjects = function () {
        var object = arguments[0],
            args = Array.prototype.slice.call(arguments, 0),
            x = 0,
            passedObject,
            prop;

        args.splice(0, 1);

        for (x; x < args.length; x++) {
            passedObject = args[x];
            for (prop in passedObject) {
                if (passedObject.hasOwnProperty(prop)) {
                    object[prop] = passedObject[prop]

                }

            }
        }

        return object;
    };

    p.extend = function (options) {

        var parent = this;
        var MoleculeObject;


        MoleculeObject = function (instanceObject) {
            return parent.call(this, p.mergeObjects(p.cloneOptions(options), instanceObject || {}));
        };

        MoleculeObject.extend = p.extend;

        var Surrogate = function () {
            this.constructor = MoleculeObject;
        };
        Surrogate.prototype = parent.prototype;
        MoleculeObject.prototype = new Surrogate;

        MoleculeObject.__super__ = parent.prototype;

        return MoleculeObject;

    };

    p.registeredEvents = [];
    p.createEventClosure = function (type, callback, context) {

        var event = {
            type: type,
            context: context,
            callback: function (event) {
                callback.apply(context, event.detail);
            }
        };
        p.registeredEvents.push(event);

        return event.callback;

    };

    function Molecule(options) {

        options = options || {};

        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                this[prop] = options[prop];
            }
        }

        // Clone sprites
        if (this.sprite) {
            this.sprite = this.sprite.clone();
        }

        var sprites = this.sprites;
        this.sprites = {};
        for (var sprite in sprites) {
            if (sprites.hasOwnProperty(sprite) && sprites[sprite]) {
                this.sprites[sprite] = sprites[sprite].clone();
            }
        }

        var text = this.text;
        this.text = {};
        for (var textProp in text) {
            if (text.hasOwnProperty(textProp)) {
                this.text[textProp] = text[textProp].clone();
            }
        }

        var audio = this.audio;
        this.audio = {};
        for (var sound in audio) {
            if (audio.hasOwnProperty(sound)) {
                this.audio[sound] = audio[sound].clone();
            }
        }
        
        var webaudio = this.webaudio;
        this.webaudio = {};
        for (var sound in webaudio) {
            if (webaudio.hasOwnProperty(sound)) {
                this.webaudio[sound] = webaudio[sound].clone();
            }
        }

        this.init()
    }

    Molecule.prototype.sprite = null;
    Molecule.prototype.sprites = {};

    Molecule.prototype.init = function () {

    };

    Molecule.prototype.update = function () {

    };

    Molecule.prototype.listenTo = function (type, callback) {

        window.addEventListener(type, p.createEventClosure(type, callback, this));

    };

    Molecule.prototype.removeListeners = function () {
        var event;
        for (var x = 0; x < p.registeredEvents.length; x++) {
            event = p.registeredEvents[x];
            if (event.context === this) {
                window.removeEventListener(event.type, event.callback);
                p.registeredEvents.splice(x, 1);
                x--;
            }
        }
    };

    Molecule.extend = p.extend;


    return Molecule;

});