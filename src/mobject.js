Molecule.module('Molecule.MObject', function (require, p) {

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
                    object[prop] = passedObject[prop];
                }
            }
        }

        return object;
    };

    function MObject (options) {
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                this[prop] = options[prop];
            }
        }

        // Clone sprites
        if (this.sprite) {
            this.sprite = this.sprite.clone();
        }

        for (var sprite in this.sprites) {
            if (this.sprites.hasOwnProperty(sprite)) {
                this.sprites[sprite] = this.sprites[sprite].clone();
            }
        }

        this.init()
    }

    MObject.prototype.sprite = null;
    MObject.prototype.sprites = {};

    MObject.prototype.init = function () {

    };

    MObject.prototype.update = function () {

    };

    // TODO: Create correct inheritance to check INSTANCEOF
    MObject.extend = function (options) {
        var parent = this;
        var child;

            child = function(){ return parent.apply(this, arguments); };

        p.mergeObjects(child, parent, options);

        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (options) p.mergeObjects(child.prototype, options);

        child.__super__ = parent.prototype;

        return child;

    };


    return MObject;

});