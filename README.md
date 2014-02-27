Molecule - HTML5 Game Framework
===============================

This is the official repository for the Molecule HTML5 Game Framework. All
documentation, features and examples can be seen on the official website:
[http://www.moleculejs.net](http://www.moleculejs.net)

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
