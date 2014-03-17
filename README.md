Molecule - HTML5 Game Framework
===============================

This is the official repository for the Molecule HTML5 Game Framework. All
documentation, features and examples can be seen on the official website:
[http://www.moleculejs.net](http://www.moleculejs.net)

### CHANGE LOG

##### 0.9.2
- Optimized collisions and fixed bugs
- Changed the concept of object to "molecule". Check tutorials for more information
- Added game.log method, which can be used as console.log, only it will only log ones
- Added Molecule().ready() which encourages to use a "molecule" as starting point of your game
- Added events listening, read tutorials for more info
- Added game.timeout, read tutorials for more info
- Fixed general bugs

##### 0.9.1
- Changed API of creating, adding and removing sprites, Molecule Objects and text. It is now more consistent. Check out the tutorials
- Added a powerful "get" API to let you easily fetch entities in your game
- You can now add Molecule properties on objects in Tiled map editor. Tutorial coming soon!
- game.Object.extend is now changed to game.object.define, for consistency reasons. You can still do:<br> var myObj = game.object.define({});<br> var extendedObj = myObj.extend({});
- You can now append the canvas to a target dom node using ID. Check basic tutorial
- Changed text.x and text.y to text.position.x and text.position.y for consistency
- Added game.once method. game.once(function () { console.log('hey'); }). Will only trigger once. Nice for debug

´´´javascript

var myObj = game.object.define({});
var myExtendedObject = myObject.extend({});

´´´

### Build instructions

The easiest way to build molecule uses [grunt](http://gruntjs.com/), which requires [node](http://www.nodejs.org/) and [npm](https://npmjs.org/). Once installed, run ```npm install``` from molecule root directory (this will pull down about 30MB of node packages). From then on, just simply run ```grunt``` to build (it will create molecule.js and molecule.min.js on the build directory).

### Code style guide

- Use lowerCamelCase as a naming convention (It is very common in JS to use firstName, lastName).
- Use 4 spaces (soft tabs), instead tabs (hard tabs).
- No trailing whitespace on blank lines.
- Always use strict equal === unless you need to do any type conversion.
- Use single quotation mark ' instead double quotation mark ".
- Comments should have their own line, no trailing comments, and the line above should be empty.
- On if/for etc. there should always be brackets, even though not needed (often you put more into the if, and then you do not have to add them again).
- Always use literal notation, no new Array(), but [].
