(function (window) {

    var definedModules = [];
    var moleculeModules = [];
    var initializedModules = [];
    var isTest = false;
    var timeoutLimit = 100;
    var game = null;

    var p = {
        Module: function Module(name, func) {
            this.name = name;
            this.func = func;
        },
        isModule: function (module) {
            return module instanceof p.Module;
        },
        'throw': function (message) {
            throw Error('Molecule Error: ' + message);
        },
        getSinon: function () {
            return window.sinon;
        },
        getModule: function (name, modules) {
            var module;
            for (var x = 0; x < modules.length; x++) {
                if (modules[x].name === name) {
                    module = modules[x];
                    break;
                }
            }
            if (!module) p.throw('Could not require module: "' + name + '". The name does not exist or loading it causes a loop.');
            return module;
        },
        addModule: function (array, name, func) {
            array.push(new p.Module(name, func));
        },
        registerModules: function (defined, initialized) {
            var module,
                context,
                initializeModule = true,
                startTime = new Date().getTime(),
                depExceptions = [];
            while (defined.length && !p.timeout(startTime)) {
                initializeModule = true;
                module = p.getLast(defined);
                context = p.createContext(initialized);
                try {
                    context.exports = module.func.apply(context, p.contextToArray(context));
                } catch (e) {
                    // Dependency not ready
                    if (e.message.match(/Molecule Error/)) {
                        p.addDepException(depExceptions, e.message);
                        p.moveLastToFirst(defined);
                        initializeModule = false;
                    } else {
                        throw e;
                    }
                }
                if (initializeModule && typeof context.exports === 'undefined') {
                    p.throw('Module ' + module.name + ' is returning undefined, it has to return something');
                }
                if (initializeModule) {
                    module.exports = context.exports;
                    p.moveLastToTarget(defined, initialized);
                }
            }

            if (p.timeout(startTime)) {
                p.throw('Timeout, could not load modules. The following dependencies gave errors: ' +
                    (depExceptions.length ? depExceptions.join(', ') : '') +
                    '. They do not exist or has caused a loop.');
            }
        },
        contextToArray: function (context) {
            if (game) {
                return [game, context.require, context.privates];
            } else {
                return [context.require, context.privates];
            }

        },
        registerTestModule: function (name, defined) {
            var module,
                context,
                testModule,
                startTime = new Date().getTime(),
                depExceptions = [];
            while (!testModule && !p.timeout(startTime)) {
                module = p.getLast(defined);
                context = p.createTestContext(defined);
                if (module.name === name) {
                    try {
                        context.exports = module.func.apply(context, p.contextToArray(context));
                    } catch (e) {
                        if (e.message.match(/Molecule Error/)) {
                            p.addDepException(depExceptions, e.message);
                            p.moveLastToFirst(defined);
                        } else {
                            throw e;
                        }
                    }
                    testModule = module;
                } else {
                    p.moveLastToFirst(defined);
                }
            }
            if (p.timeout(startTime)) {
                p.throw('Timeout, could not load modules. The following dependencies gave errors: ' +
                    (depExceptions.length ? depExceptions.join(', ') : name) +
                    '. They do not exist or has caused a loop.');
            }

            if (!context.exports && !depExceptions.length) {
                p.throw('Module ' + testModule.name + ' is returning undefined, it has to return something');
            } else if (depExceptions.length) {
                p.throw('The following dependencies gave errors: ' + depExceptions.join(', ') +
                    '. They do not exist or has caused a loop.');
            }

            return context;

        },
        timeout: function (startTime) {
            return new Date().getTime() - startTime >= timeoutLimit;
        },
        addDepException: function (array, message) {
            message = message.match(/\"(.*)\"/)[1];
            if (array.indexOf(message) === -1) {
                array.push(message);
            }
        },
        createGame: function (options) {
            var Game = p.getModule('Molecule.Game', initializedModules).exports;
            game = new Game(options);
        },
        createContext: function (modules) {
            var context = {
                privates: {},
                require: function (name) {
                    var module = p.getModule(name, modules);
                    return p.isModule(module) ? module.exports : module; // Return exports only if it is a module-loader module
                },
                game: game
            }
            return context;
        },
        createTestContext: function (modules) {
            var context = {
                privates: {},
                deps: {}
            };
            context.require = p.createTestRequireMethod(context, modules);

            return context;
        },
        createTestRequireMethod: function (context, modules) {
            return function (name) {
                var depExceptions = [];
                var depModule = p.getModule(name, modules),
                    depContext = {
                        privates: {},
                        require: function (name) { // TODO: Make this more general with registerModule

                            var module = p.getModule(name, modules);

                            try {
                                module = module.func.apply(context, p.contextToArray(context));
                            } catch (e) {
                                if (e.message.match(/Molecule Error/)) {
                                    p.addDepException(depExceptions, e.message);
                                } else {
                                    throw e;
                                }
                            }

                            return p.isModule(module) ? module.exports : module; // Return exports only if it is a module-loader module

                        }
                    };

                depContext.exports = p.isModule(depModule) ? depModule.func.apply(depContext, p.contextToArray(depContext)) : depModule;

                // Adds the dependency exports to the main context
                // which lets you edit the stubs in the test
                depModule.exports = p.stubDepExports(depContext.exports);
                context.deps[name] = depModule.exports;

                return depModule.exports;
            }
        },
        stubDepExports: function (exports) {
            var sinon = p.getSinon();
            if (sinon) {
                var stubbedMethods = {};

                if (typeof exports === 'function') {
                    return sinon.spy();
                } else {
                    for (var depMethod in exports) {
                        if (typeof exports[depMethod] === 'function') {
                            stubbedMethods[depMethod] = exports[depMethod];
                            sinon.stub(stubbedMethods, depMethod);
                        }
                    }
                }

                return stubbedMethods;
            }
            return exports;
        },
        getLast: function (modules) {
            return modules[modules.length - 1];
        },
        moveLastToFirst: function (modules) {
            modules.unshift(modules.pop());
        },
        moveLastToTarget: function (sourceArray, targetArray) {
            targetArray.push(sourceArray.pop());
        },
        extractBrowserArgs: function (args) {
            return {
                name: args[0],
                func: args[1]
            }
        }
    };


    var Molecule = function (options) {
        p.registerModules(moleculeModules, initializedModules);
        p.createGame(options);
        return Molecule;
    };

    Molecule.module = function () {
        var args = p.extractBrowserArgs(arguments);
        if (!args.name || typeof args.name !== 'string' || !args.func || typeof args.func !== 'function') {
            p.throw('Invalid arguments for module creation, you have to pass a string and a function');
        }
        if (args.name.match(/Molecule/)) {
            p.addModule(moleculeModules, args.name, args.func);
        } else {
            p.addModule(definedModules, args.name, args.func);
        }

        return this;

    };

    Molecule.init = function (callback) {
        var initializeModules = function () {
            p.registerModules(definedModules, initializedModules);
        };
        game.init(initializeModules, callback);
        game.start();
        return this;

    };

    Molecule.update = function (callback) {
        game.update(callback);
        return this;
    };

    Molecule.sprite = function (id, spriteSrc, frameWidth, frameHeight) {
        game.imageFile.load(id, spriteSrc, frameWidth, frameHeight);
        return this;
    };

    Molecule.sound = function (id, soundSrc) {
        game.audioFile.load(id, soundSrc);
        return this;
    };

    Molecule.tilemap = function (id, mapSrc) {
        game.mapFile.load(id, mapSrc);
        return this;
    };

    Molecule.test = function (name, callback) {
        isTest = true;
        var context = p.registerTestModule(name, definedModules);
        callback.apply(context, [context.exports, context.privates, context.deps]);
    };


    window.Molecule = Molecule;

}(window));