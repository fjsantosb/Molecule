Molecule.module('Molecule.utils', function (require, p) {

    p.createMethodClosure = function (object, prop, context) {
        return object[prop].bind(context);
    };

    p.matchByObject = function (returnArray, objToMatch, containsProps) {

        return function (obj) {

            if (containsProps(obj, objToMatch)) {
                returnArray.push(obj);
            }

        }

    };

    p.matchByFunction = function (returnArray, matchFunc) {

        return function (obj) {

            if ((typeof matchFunc._MoleculeType === 'undefined' || matchFunc._MoleculeType === obj._MoleculeType) && matchFunc(obj)) {
                returnArray.push(obj);
            }

        }

    };

    return {

        deepClone: function (source, target, props) {

            for (var prop in source) {
                if (source.hasOwnProperty(prop) && (!props || (props && props.indexOf(prop) >= 0))) {

                    if (source[prop] instanceof Array) {
                        target[prop] = source[prop].slice(0);
                    } else if (typeof source[prop] === 'object' && source[prop] !== null) {
                        target[prop] = this.deepClone(source[prop], {});
                    } else {
                        target[prop] = source[prop];
                    }

                }
            }

            return target;

        },
        mergeSafely: function (source, target, invalidProps) {
            invalidProps = invalidProps || [];
            for (var prop in source) {
                if (source.hasOwnProperty(prop) && invalidProps.indexOf(prop) === -1) {
                    target[prop] = source[prop];
                } else if (invalidProps.indexOf(prop) >= 0) {
                    throw new Error('You can not set or change the property ' + prop);
                }
            }
        },
        bindMethods: function (object, context) {

            for (var prop in object) {

                if (object.hasOwnProperty(prop) && typeof object[prop] === 'function') {
                    object[prop] = p.createMethodClosure(object, prop, context)
                }
            }

        },
        isMolecule: function (obj) {

            if (!obj) {
                return false;
            }

            // Can not use instanceof here
            return this.isObject(obj) && 'init' in obj && 'update' in obj;

        },
        isSprite: function (sprite) {
            var Sprite = require('Molecule.Sprite');
            return sprite instanceof Sprite;

        },
        isAudio: function (audio) {
            var MAudio = require('Molecule.MAudio');
            return audio instanceof MAudio;
        },
        isText: function (text) {
            var Text = require('Molecule.Text');
            return text instanceof Text;

        },
        isTilemap: function (tilemap) {
            var Map = require('Molecule.Map');
            return tilemap instanceof Map;
        },
        isObject: function (obj) {
            if (!obj) {
                return false;
            }
            return typeof obj === 'object' && !(obj instanceof Array) && obj !== null;
        },
        isString: function (string) {
            return typeof string === 'string';
        },
        find: function (array) {
            var returnArray = [];

            if (typeof arguments[1] === 'function') {
                array.forEach(p.matchByFunction(returnArray, arguments[1]));
            } else {
                array.forEach(p.matchByObject(returnArray, arguments[1], this.containsProps));
            }

            return returnArray;
        },
        containsProps: function (obj, objToMatch) {
            var match = true,
                prop;

            for (prop in objToMatch) {

                if (objToMatch.hasOwnProperty(prop) && obj[prop] !== objToMatch[prop]) {
                    match = false;
                }
            }

            return match;

        }

    };

});