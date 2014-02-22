Molecule.module('Molecule.Physics', function (require, p) {

    p.addFriction = function (sprite, game) {
        if (sprite.speed.x > 0) {
            sprite.speed.x = sprite.speed.x * (1 - game.physics.friction.x);
            if (sprite.speed.x < 0.05) {
                sprite.speed.x = 0;
            }
        } else if (sprite.speed.x < 0) {
            sprite.speed.x = sprite.speed.x * (1 - game.physics.friction.x);
            if (sprite.speed.x > 0.05) {
                sprite.speed.x = 0;
            }
        }
        if (sprite.speed.y > 0) {
            sprite.speed.y = sprite.speed.y * (1 - game.physics.friction.y);
            if (sprite.speed.y < 0.05) {
                sprite.speed.y = 0;
            }
        } else if (sprite.speed.y < 0) {
            sprite.speed.y = sprite.speed.y * (1 - game.physics.friction.y);
            if (sprite.speed.y > 0.05) {
                sprite.speed.y = 0;
            }
        }
    };

    p.spriteHitsPlatformBelow = function (sprite, game) {
    	return sprite.affects.physics.gravity && game.physics.gravity.y > 0 && sprite.collision.sprite.down && game.scene.sprites[sprite.collision.sprite.id].platform;
    };

    p.spriteHitsPlatformAbove = function (sprite, game) {
      	return sprite.affects.physics.gravity && game.physics.gravity.y < 0 && sprite.collision.sprite.up && game.scene.sprites[sprite.collision.sprite.id].platform;
    };

    p.spriteHitsPlatformRight = function (sprite, game) {
      	return sprite.affects.physics.gravity && game.physics.gravity.x > 0 && sprite.collision.sprite.right && game.scene.sprites[sprite.collision.sprite.id].platform;
    };

    p.spriteHitsPlatformLeft = function (sprite, game) {
		return sprite.affects.physics.gravity && game.physics.gravity.x < 0 && sprite.collision.sprite.left && game.scene.sprites[sprite.collision.sprite.id].platform;
    };

    p.spriteSlowerThanCollisionSprite = function (axis, sprite, game) {
        return sprite.speed[axis] >= 0 && sprite.speed[axis] < game.scene.sprites[sprite.collision.sprite.id].speed[axis];
    };

    p.spriteFasterThanCollisionSprite = function (axis, sprite, game) {
        return sprite.speed[axis] <= 0 && sprite.speed[axis] > game.scene.sprites[sprite.collision.sprite.id].speed[axis];
    };

    p.increaseAcceleration = function (sprite) {
        sprite.speed.x += sprite.acceleration.x;
        sprite.speed.y += sprite.acceleration.y;
    };

    p.setSpeed = function (sprite) {
        var sx = sprite.speed.x >= 0 ? 1 : -1;
        var sy = sprite.speed.y >= 0 ? 1 : -1;
        if (Math.abs(sprite.speed.x) > sprite.speed.max.x) {
            sprite.speed.x = sprite.speed.max.x * sx;
        }
        if (Math.abs(sprite.speed.y) > sprite.speed.max.y) {
            sprite.speed.y = sprite.speed.max.y * sy;
        }
    };

    p.addGravity = function (sprite, game) {
        sprite.speed.x -= sprite.speed.gravity.x;
        sprite.speed.y -= sprite.speed.gravity.y;
        if (sprite.affects.physics.gravity) {
            sprite.speed.gravity.x += game.physics.gravity.x;
            sprite.speed.gravity.y += game.physics.gravity.y;
        }
        sprite.speed.x += sprite.speed.gravity.x;
        sprite.speed.y += sprite.speed.gravity.y;
    };

    p.cleanUpSpeed = function (sprite) {
        sprite.speed.x = parseFloat(sprite.speed.x.toFixed(3));
        sprite.speed.y = parseFloat(sprite.speed.y.toFixed(3));
        sprite.speed.t.x += sprite.speed.x;
        sprite.speed.t.y += sprite.speed.y;
        sprite.speed.t.x = parseFloat(sprite.speed.t.x.toFixed(3));
        sprite.speed.t.y = parseFloat(sprite.speed.t.y.toFixed(3));
        sprite.resetAcceleration();
        if (sprite.speed.x === 0) {
            sprite.speed.t.x = 0;
        }
        if (sprite.speed.y === 0) {
            sprite.speed.t.y = 0;
        }
    };

    return function (game) {
        var sprite;
        for (var i = 0; i < game.scene.sprites.length; i++) {
            sprite = game.scene.sprites[i];

            if (sprite.affects.physics.friction) {
                p.addFriction(sprite, game);
            }
            
            if (p.spriteHitsPlatformBelow(sprite, game) || p.spriteHitsPlatformAbove(sprite, game)) {

                if (p.spriteSlowerThanCollisionSprite('x', sprite, game)) {
                    sprite.speed.x = game.scene.sprites[sprite.collision.sprite.id].speed.x;
                } else if (p.spriteFasterThanCollisionSprite('x', sprite, game)) {
                    sprite.speed.x = game.scene.sprites[sprite.collision.sprite.id].speed.x;
                }

            } else if (p.spriteHitsPlatformRight(sprite, game) || p.spriteHitsPlatformLeft(sprite, game)) {

                if (p.spriteSlowerThanCollisionSprite('y', sprite, game)) {
                    sprite.speed.y = game.scene.sprites[sprite.collision.sprite.id].speed.y;
                } else if (p.spriteFasterThanCollisionSprite('y', sprite, game)) {
                    sprite.speed.y = game.scene.sprites[sprite.collision.sprite.id].speed.y;
                }

            }

            p.increaseAcceleration(sprite);
            p.setSpeed(sprite);
            p.addGravity(sprite, game);
            p.cleanUpSpeed(sprite);

        }

    }

});