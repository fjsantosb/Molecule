Molecule.module('Molecule.MapCollisions', function (require, p) {

    p.spriteCollidesWithLayer = function (layer, sprite) {
        return layer.type === 'tilelayer' && layer.properties.collidable && sprite.collides.map;
    };

    p.getHeight = function (tileHeight, sprite) {
        return Math.ceil((sprite.frame.height - sprite.frame.offset.y - sprite.frame.offset.y) / tileHeight);
    };

    p.getWidth = function (tileWidth, sprite) {
        return Math.ceil((sprite.frame.width - sprite.frame.offset.x - sprite.frame.offset.x) / tileWidth);
    };

    p.getPosX = function (layer, sprite, tileWidth) {
        return sprite.position.x - sprite.anchor.x + sprite.move.x + Math.abs(layer.x) + tileWidth;
    };

    p.getPosY = function (layer, sprite, tileHeight) {
        return sprite.position.y - sprite.anchor.y + sprite.move.y + Math.abs(layer.y) + tileHeight;
    };

    p.updateCollisionX = function (layer, sprite, tile, j, physics) {
        if (sprite.collidesWithTile(layer, tile, j)) {
            if (sprite.move.y > 0) {
                sprite.collision.map.down = true;
                sprite.collision.map.tile = tile;
            }
            if (sprite.move.y < 0) {
                sprite.collision.map.up = true;
                sprite.collision.map.tile = tile;
            }
            if (sprite.collision.map.down && physics.gravity.y > 0) {
                sprite.speed.gravity.y = 0;
            }
            if (sprite.collision.map.up && physics.gravity.y < 0) {
                sprite.speed.gravity.y = 0;
            }
            if ((sprite.collision.check.map.up && sprite.collision.map.up) || (sprite.collision.check.map.down && sprite.collision.map.down)) {
                sprite.move.y = 0;
                sprite.speed.y = 0;
                sprite.speed.t.y = 0;
            }
        }
    };

    p.updateCollisionY = function (layer, sprite, tile, j, physics) {

        if (sprite.collidesWithTile(layer, tile, j)) {
            if (sprite.move.x > 0) {
                sprite.collision.map.right = true;
                sprite.collision.map.tile = tile;
            }
            if (sprite.move.x < 0) {
                sprite.collision.map.left = true;
                sprite.collision.map.tile = tile;
            }
            if (sprite.collision.map.left && physics.gravity.x < 0) {
                sprite.speed.gravity.x = 0;
            }
            if (sprite.collision.map.right && physics.gravity.x > 0) {
                sprite.speed.gravity.x = 0;
            }
            if ((!sprite.collision.check.map.up && sprite.collision.map.up) || (!sprite.collision.check.map.down && sprite.collision.map.down)) {
            } else {
                if ((sprite.collision.check.map.left && sprite.collision.map.left) || (sprite.collision.check.map.right && sprite.collision.map.right)) {
                    sprite.move.x = 0;
                    sprite.speed.x = 0;
                    sprite.speed.t.x = 0;
                }
            }
        }
    };

    return function (game) {
        var map = game.map,
            sprites = game.scene.sprites,
            i,
            j,
            k,
            l,
            sprite,
            layer,
            mc,
            tile,
            tx,
            ty;

        if (!map || !map.json) {
            return;
        }

        for (i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            for (j = 0; j < map.json.layers.length; j++) {
                layer = map.json.layers[j];
                if (p.spriteCollidesWithLayer(layer, sprite)) {
                    mc = 0;
                    while (mc <= 2) {
                        if (sprite.move.x !== 0 || sprite.move.y !== 0) {
                            for (k = 0; k <= p.getHeight(map.json.tileheight, sprite); k++) {
                                for (l = 0; l <= p.getWidth(map.json.tilewidth, sprite); l++) {
                                    tile = map.getTile(layer.name, p.getPosX(layer, sprite, l * map.json.tilewidth), p.getPosY(layer, sprite, k * map.json.tileheight), sprite.frame.width, sprite.frame.height);
                                    if (tile !== null && layer.data[tile % layer.data.length] > 0 && sprite.collidesWithTile(layer, tile, j)) {
                                        if (mc === 0 || mc === 2) {
                                            tx = sprite.move.x;
                                            sprite.move.x = 0;
                                            p.updateCollisionX(layer, sprite, tile, j, game.physics);
                                            sprite.move.x = tx;
                                        }
                                        if (mc === 1 || mc === 2) {
                                            ty = sprite.move.y;
                                            if (mc !== 2)
                                                sprite.move.y = 0;
                                            p.updateCollisionY(layer, sprite, tile, j, game.physics);
                                            sprite.move.y = ty;
                                        }
                                    }
                                }
                            }
                        }
                        mc++;
                    }
                }
            }
        }
    }
});