Molecule.module('Player', function (game) {
    return game.molecule.define({
        sprites: {
            plane: null,
            plane_shadow: game.sprite.create('plane_shadow')
        },
        score: 0,
        canFire: false,
        gamepad: null,
        key: null,
        tilt: 0,
        init: function () {
            this.sprites.plane = game.sprite.create('plane_' + this.id + 'up');
            
            this.sprites.plane.position.x = this.x;
            this.sprites.plane.position.y = game.height - 64;
            
            this.sprites.plane.anchor.x = this.sprites.plane.width / 2;
            this.sprites.plane.anchor.y = this.sprites.plane.height / 2;
            
            this.sprites.plane.speed.max.x = 5;
            this.sprites.plane.speed.max.y = 5;
            
            this.sprites.plane.collides.group = 0;
            
            this.sprites.plane.scrollable = false;
            
            this.sprites.plane.overlap = true;
            
            this.sprites.plane.animation.add('idle', {
                frames: [0, 1],
                speed: 0.1
            });
            
            this.sprites.plane.animation.add('left_1', {
                frames: [2, 3],
                speed: 0.1
            });
            
            this.sprites.plane.animation.add('left_2', {
                frames: [4, 5],
                speed: 0.1
            });
            
            this.sprites.plane.animation.add('right_1', {
                frames: [6, 7],
                speed: 0.1
            });
            
            this.sprites.plane.animation.add('right_2', {
                frames: [8, 9],
                speed: 0.1
            });
            
            this.sprites.plane.animation.run('idle', {
                loop: true,
                reverse: false
            });

            this.sprites.plane_shadow.position.x = this.sprites.plane.position.x + this.sprites.plane.width / 2;
            this.sprites.plane_shadow.position.y = this.sprites.plane.position.y + this.sprites.plane.height / 2;
            
            this.sprites.plane_shadow.anchor.x = this.sprites.plane_shadow.width / 1.25;
            this.sprites.plane_shadow.anchor.y = this.sprites.plane_shadow.height / 1.25;
            
            this.sprites.plane_shadow.collides.sprite = false;
            this.sprites.plane_shadow.collides.map = false;
            this.sprites.plane_shadow.collides.boundaries = false;
            
            this.sprites.plane_shadow.collidable = false;
            
            this.sprites.plane_shadow.scrollable = false;
            
            this.sprites.plane_shadow.alpha = 0.75;
            

            this.sprites.plane_shadow.animation.add('idle', {
                frames: [0],
                speed: 1
            });
            
            this.sprites.plane_shadow.animation.add('left_1', {
                frames: [1],
                speed: 1
            });
            
            this.sprites.plane_shadow.animation.add('left_2', {
                frames: [2],
                speed: 1
            });
            
            this.sprites.plane_shadow.animation.add('right_1', {
                frames: [3],
                speed: 1
            });
            
            this.sprites.plane_shadow.animation.add('right_2', {
                frames: [4],
                speed: 1
            });
            
            this.sprites.plane_shadow.animation.run('idle', {
                loop: true,
                reverse: false
            });
        },
        update: function () {
            switch (this.id) {
                case 1:
                    this.key = game.input.key;
                    if (game.input.gamepad.length > 1) {
                        this.gamepad = game.input.gamepad[0];
                    } else {
                        this.gamepad = null;
                    }
                break;
                case 2:
                    this.key = null;
                    if (game.input.gamepad.length > 1) {
                        this.gamepad = game.input.gamepad[1];
                    } else {
                        this.gamepad = game.input.gamepad[0];
                    }
                break;
            }
            
            if (((this.key && this.key.SPACE) || (this.gamepad && this.gamepad.buttons[0])) && this.canFire) {
                game.molecule.add('PlayerBullet', {x: this.sprites.plane.position.x - this.sprites.plane.width / 5, y: this.sprites.plane.position.y + this.sprites.plane.height / 2, id: this.id});
                game.molecule.add('PlayerBullet', {x: this.sprites.plane.position.x + this.sprites.plane.width / 5, y: this.sprites.plane.position.y + this.sprites.plane.height / 2, id: this.id});
                this.canFire = false; 
            } else if (!(this.key && this.key.SPACE) && !(this.gamepad && this.gamepad.buttons[0])) {
                this.canFire = true;
            }
            if ((this.key && this.key.LEFT_ARROW) || (this.gamepad && this.gamepad.axes[0] < -0.25)) {
                this.sprites.plane.acceleration.x = (this.gamepad && this.gamepad.axes[0] / 2) || -0.5;
                if (this.tilt > -60) {
                    this.tilt--;
                }
            } else {
                if (!((this.key && this.key.RIGHT_ARROW) || (this.gamepad && this.gamepad.axes[0] > 0.25)) && this.tilt < 0) {
                    this.tilt++;
                }
            }
            if ((this.key && this.key.RIGHT_ARROW) || (this.gamepad && this.gamepad.axes[0] > 0.25)) {
                this.sprites.plane.acceleration.x = (this.gamepad && this.gamepad.axes[0] / 2) || 0.5;
                if (this.tilt < 60) {
                    this.tilt++;
                }
            } else {
                if (!((this.key && this.key.LEFT_ARROW) || (this.gamepad && this.gamepad.axes[0] < -0.25)) && this.tilt > 0) {
                    this.tilt--;
                }
            }
            if ((this.key && this.key.UP_ARROW) || (this.gamepad && this.gamepad.axes[1] < -0.25)) {
                this.sprites.plane.acceleration.y = (this.gamepad && this.gamepad.axes[1] / 2) || -0.5;
            }
            if ((this.key && this.key.DOWN_ARROW) || (this.gamepad && this.gamepad.axes[1] > 0.25)) {
                this.sprites.plane.acceleration.y = (this.gamepad && this.gamepad.axes[1] / 2) || 0.5;
            }
            
            if (this.tilt < 20 && this.tilt > -20) {
                this.sprites.plane.animation.run('idle', {
                    loop: true,
                    reverse: false
                });
                this.sprites.plane_shadow.animation.run('idle', {
                    loop: true,
                    reverse: false
                });
            } else if (this.tilt < -20 && this.tilt > -40) {
                this.sprites.plane.animation.run('left_1', {
                    loop: true,
                    reverse: false
                });
                this.sprites.plane_shadow.animation.run('left_1', {
                    loop: true,
                    reverse: false
                });
            } else if (this.tilt < -40 && this.tilt > -60) {
                this.sprites.plane.animation.run('left_2', {
                    loop: true,
                    reverse: false
                });
                this.sprites.plane_shadow.animation.run('left_2', {
                    loop: true,
                    reverse: false
                });
            } else if (this.tilt > 20 && this.tilt < 40) {
                this.sprites.plane.animation.run('right_1', {
                    loop: true,
                    reverse: false
                });
                this.sprites.plane_shadow.animation.run('right_1', {
                    loop: true,
                    reverse: false
                });
            } else if (this.tilt > 40 && this.tilt < 60) {
                this.sprites.plane.animation.run('right_2', {
                    loop: true,
                    reverse: false
                });
                this.sprites.plane_shadow.animation.run('right_2', {
                    loop: true,
                    reverse: false
                });
            }
            this.sprites.plane_shadow.position.x = this.sprites.plane.position.x + this.sprites.plane.width / 1.25;
            this.sprites.plane_shadow.position.y = this.sprites.plane.position.y + this.sprites.plane.height / 1.25;
        },
        draw: function () {
            game.context.save();
            game.context.fillStyle = '#000';
            game.context.fillRect(0, game.height - 30, game.width / 4, 18);
            game.context.fillStyle = '#FF0000';
            game.context.fillRect(0, game.height - 30 + 2, game.width / (4 * 3), 18 - 4);
            game.context.fillStyle = '#FF8800';
            game.context.fillRect(game.width / (4 * 3) - 2, game.height - 30 + 2, game.width / (4 * 3), 18 - 4);
            game.context.fillStyle = '#F2D32D';
            game.context.fillRect(game.width / (4 * 1.5) - 2, game.height - 30 + 2, game.width / (4 * 3), 18 - 4);
            game.context.restore();
        }
    });
});