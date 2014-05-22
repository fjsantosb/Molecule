Molecule.module('Molecule.SpriteCollisions', function (require, p) {

    p.spritesCollide = function (spriteI, spriteJ) {
        return (spriteI.collides.group === null || spriteI.collides.group !== spriteJ.collides.group) && (spriteI.collides.sprite && spriteJ.collidable && spriteI.collidable) && (spriteI.collidesWithSprite(spriteJ))
    };

    p.updateCollisionY = function (spriteI, spriteJ, i, j, physics) {
        if (spriteI.collidesWithSprite(spriteJ)) {
            if (spriteI.move.y > 0) {
                spriteI.collision.sprite.down = true;
                spriteJ.collision.sprite.up = true;
            }
            if (spriteI.move.y < 0) {
                spriteI.collision.sprite.up = true;
                spriteJ.collision.sprite.down = true;
            }
            if (spriteI.collision.sprite.down && physics.gravity.y > 0) {
                spriteI.speed.gravity.y = 0;
            }
            if (spriteI.collision.sprite.up && physics.gravity.y < 0) {
                spriteI.speed.gravity.y = 0;
            }
            spriteI.collision.sprite.id = j;
            spriteJ.collision.sprite.id = i;
            if(spriteI.collides.sprite && spriteJ.collides.sprite) {
                spriteI.move.y = 0;
                spriteI.speed.y = 0;
                spriteI.speed.t.y = 0;
            }
        }
    };

    p.updateCollisionX = function (spriteI, spriteJ, i, j, physics) {
        if (spriteI.collidesWithSprite(spriteJ)) {
            if (spriteI.move.x > 0) {
                spriteI.collision.sprite.right = true;
                spriteJ.collision.sprite.left = true;
            }
            if (spriteI.move.x < 0) {
                spriteI.collision.sprite.left = true;
                spriteJ.collision.sprite.right = true;
            }
            if (spriteI.collision.sprite.left && physics.gravity.x < 0) {
                spriteI.speed.gravity.x = 0;
            }
            if (spriteI.collision.sprite.right && physics.gravity.x > 0) {
                spriteI.speed.gravity.x = 0;
            }
            spriteI.collision.sprite.id = j;
            spriteJ.collision.sprite.id = i;
            if(spriteI.collides.sprite && spriteJ.collides.sprite) {
                spriteI.move.x = 0;
                spriteI.speed.x = 0;
                spriteI.speed.t.x = 0;
            }
        }
    };

    return function (game) {
        var sprites = game.scene.sprites,
            physics = game.physics,
            i,
            j,
            k,
            mc,
            tx,
            ty,
            tjx,
            tjy,
            spriteI,
            spriteJ;
        
        for (i = 0; i < sprites.length; i++) {
            spriteI = sprites[i];
            for (j = 0; j < sprites.length; j++) {
                spriteJ = sprites[j];

                if (i !== j) {

                    tjx = spriteJ.move.x;
                    tjy = spriteJ.move.y;

                    if (j > i) {
                        spriteJ.move.x = 0;
                        spriteJ.move.y = 0;
                    }
                    
                    if (p.spritesCollide(spriteI, spriteJ)) {
                        mc = 0;
                        while (mc <= 2) {
                            if (spriteI.move.x !== 0 || spriteI.move.y !== 0) {
                                if (mc === 0 || mc === 2) {
                                    tx = spriteI.move.x;
                                    if (mc !== 2)
                                        spriteI.move.x = 0;
                                    p.updateCollisionY(spriteI, spriteJ, i, j, physics);
                                    spriteI.move.x = tx;
                                }
                                if (mc === 1 || mc === 2) {
                                    ty = spriteI.move.y;
                                    if (mc !== 2)
                                        spriteI.move.y = 0;
                                    p.updateCollisionX(spriteI, spriteJ, i, j, physics);
                                    spriteI.move.y = ty;
                                }
                            }
                            mc++;
                        }
                    }

                    spriteJ.move.x = tjx;
                    spriteJ.move.y = tjy;
                }
            }
        }
    };
});