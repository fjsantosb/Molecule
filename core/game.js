var Game = function(_width, _height, _scale) {
	this.canvas = null;
	this.context = null;
	this.scale = _scale || 1;
	this.physics = {gravity: {x: 0, y: 0}, friction: {x: 0, y: 0}};
	this.boundaries = {x: null, y: null, width: null, height: null};
	this.map = new Map(this);
	this.camera = new Camera(this);
	this.scene = new Scene(this);
	this.next = {scene: null, fade: null};
	this.sprite = new ImageFile(this);
	this.audio = new AudioFile(this);
	this.sound = new Array();
	this.input = new Input(this);
	this.status = 1;
	this.timer = {loop: 60 / 1000, previus: null, now: null, fps: 60, frame: 0};
	
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('id', 'canvas');
	
	this.canvas.width = _width;
	this.canvas.height = _height;

	this.canvas.style.width = _width * _scale + "px";
	this.canvas.style.height = _height * _scale + "px";
	this.context = this.canvas.getContext('2d');
	
	document.body.appendChild(this.canvas);
	
	this.canvasSprite = document.createElement('canvas');
	this.contextSprite = this.canvasSprite.getContext('2d');
	this.canvasMap = document.createElement('canvas');
	this.contextMap = this.canvasMap.getContext('2d');
	
    this.canvasSprite.width = this.canvas.width;
    this.canvasSprite.height = this.canvas.height;
    this.canvasMap.width = this.canvas.width;
    this.canvasMap.height = this.canvas.height;
};

Game.prototype.start = function() {
	var self = this;
	var interval = setInterval(function(){self.loadResources(interval)}, 100);
};

Game.prototype.loadResources = function(_interval) {
	if(this.sprite.isLoaded() && this.audio.isLoaded()) {
		clearInterval(_interval);
		for(var i = 0; i < this.scene.sprite.length; i++) {
			this.scene.sprite[i].getAnimation();
		}
		init();
		this.setCamera();
		this.loop();
	}
};

Game.prototype.text = function(_title, _x, _y) {
	var t = new Message(_title, _x, _y, this);
	this.scene.text.push(t);
	return t;
};

Game.prototype.setCamera = function() {
	if(this.scene.camera.type === 1) {
		_x = this.scene.camera.sprite.position.x;
		this.scene.camera.sprite.position.x = 0;
		_y = this.scene.camera.sprite.position.y;
		this.scene.camera.sprite.position.y = 0;
		for(var i = 0; i < _x; i++) {
			this.scene.camera.sprite.move.x = 1;
			this.scene.camera.update(this.scene.sprite);
			this.update();
			this.reset();
		}
		
		for(var i = 0; i < _y; i++) {
			this.scene.camera.sprite.move.y = 1;
			this.scene.camera.update(this.scene.sprite);
			this.update();
			this.reset();
		}
	}
};

Game.prototype.loop = function() {
	var self = this;
	this.removeSprite();
	update();
	if(this.status == 1 && this.scene.status == 1) {
		var exit = false;
		this.updatePhysics();
		this.updateCollisionState();
		while(!exit) {
			exit = this.updateMove();
			this.updateMapCollision();
			this.updateSpriteCollision();
			this.updateSpriteCollisionCheck();
			if(this.scene.camera.type === 1) {
				this.scene.camera.update(this.scene.sprite);
			}
			this.update(exit);
			this.checkBoundaries();
			this.reset();
		}
	}
	this.draw();
	requestAnimFrame(function(){self.loop()});
};

Game.prototype.updateTimer = function() {
	this.timer.frame++;
	this.timer.now = new Date().getTime();
	if(this.timer.previus !== null)
		this.timer.loop = (this.timer.now - this.timer.previus) / 1000;
	if(this.timer.now - this.timer.previus >= 1000) {
		this.timer.previus = this.timer.now;
		this.timer.fps = this.timer.frame;
		this.timer.frame = 0;
		console.log(this.timer.fps);
	}
};

Game.prototype.updateCollisionState = function() {
	for(var i = 0; i < this.scene.sprite.length; i++) {
		this.scene.sprite[i].collision.sprite.left = false;
		this.scene.sprite[i].collision.sprite.right = false;
		this.scene.sprite[i].collision.sprite.up = false;
		this.scene.sprite[i].collision.sprite.down = false;
		
		this.scene.sprite[i].collision.map.left = false;
		this.scene.sprite[i].collision.map.right = false;
		this.scene.sprite[i].collision.map.up = false;
		this.scene.sprite[i].collision.map.down = false;
	}
};

Game.prototype.updatePhysics = function() {
	for(var i = 0; i < this.scene.sprite.length; i++) {
		if(this.scene.sprite[i].affects.physics.friction) {
			if(this.scene.sprite[i].speed.x > 0) {
				this.scene.sprite[i].speed.x = this.scene.sprite[i].speed.x * (1 - this.scene.physics.friction.x);
				if(this.scene.sprite[i].speed.x < 0.05) {
					this.scene.sprite[i].speed.x = 0;
				}
			} else if(this.scene.sprite[i].speed.x < 0) {
				this.scene.sprite[i].speed.x = this.scene.sprite[i].speed.x * (1 - this.scene.physics.friction.x);
				if(this.scene.sprite[i].speed.x > 0.05) {
					this.scene.sprite[i].speed.x = 0;
				}
			}
			if(this.scene.sprite[i].speed.y > 0) {
				this.scene.sprite[i].speed.y = this.scene.sprite[i].speed.y * (1 - this.scene.physics.friction.y);
				if(this.scene.sprite[i].speed.y < 0.05) {
					this.scene.sprite[i].speed.y = 0;
				}
			} else if(this.scene.sprite[i].speed.y < 0) {
				this.scene.sprite[i].speed.y = this.scene.sprite[i].speed.y * (1 - this.scene.physics.friction.y);
				if(this.scene.sprite[i].speed.y > 0.05) {
					this.scene.sprite[i].speed.y = 0;
				}
			}
		}
		
		if(this.scene.sprite[i].affects.physics.gravity && this.scene.physics.gravity.y > 0 && this.scene.sprite[i].collision.sprite.down && this.scene.sprite[this.scene.sprite[i].collision.sprite.id].platform) {
			if(this.scene.sprite[i].speed.x >= 0 && this.scene.sprite[i].speed.x < this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.x) {
				this.scene.sprite[i].speed.x = this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.x;
			} else if(this.scene.sprite[i].speed.x <= 0 && this.scene.sprite[i].speed.x > this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.x) {
				this.scene.sprite[i].speed.x = this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.x;
			}
		} else if(this.scene.sprite[i].affects.physics.gravity && this.scene.physics.gravity.y < 0 && this.scene.sprite[i].collision.sprite.up && this.scene.sprite[this.scene.sprite[i].collision.sprite.id].platform) {
			if(this.scene.sprite[i].speed.x >= 0 && this.scene.sprite[i].speed.x < this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.x) {
				this.scene.sprite[i].speed.x = this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.x;
			} else if(this.scene.sprite[i].speed.x <= 0 && this.scene.sprite[i].speed.x > this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.x) {
				this.scene.sprite[i].speed.x = this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.x;
			}
		} else if(this.scene.sprite[i].affects.physics.gravity && this.scene.physics.gravity.x > 0 && this.scene.sprite[i].collision.sprite.right && this.scene.sprite[this.scene.sprite[i].collision.sprite.id].platform) {
			if(this.scene.sprite[i].speed.y >= 0 && this.scene.sprite[i].speed.y < this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.y) {
				this.scene.sprite[i].speed.y = this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.y;
			} else if(this.scene.sprite[i].speed.y <= 0 && this.scene.sprite[i].speed.y > this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.y) {
				this.scene.sprite[i].speed.y = this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.y;
			}
		} else if(this.scene.sprite[i].affects.physics.gravity && this.scene.physics.gravity.x < 0 && this.scene.sprite[i].collision.sprite.left && this.scene.sprite[this.scene.sprite[i].collision.sprite.id].platform) {
			if(this.scene.sprite[i].speed.y >= 0 && this.scene.sprite[i].speed.y < this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.y) {
				this.scene.sprite[i].speed.y = this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.y;
			} else if(this.scene.sprite[i].speed.y <= 0 && this.scene.sprite[i].speed.y > this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.y) {
				this.scene.sprite[i].speed.y = this.scene.sprite[this.scene.sprite[i].collision.sprite.id].speed.y;
			}
		}
		
		this.scene.sprite[i].speed.x += this.scene.sprite[i].acceleration.x;
		this.scene.sprite[i].speed.y += this.scene.sprite[i].acceleration.y;
		var sx = this.scene.sprite[i].speed.x >= 0 ? 1 : -1;
		var sy = this.scene.sprite[i].speed.y >= 0 ? 1 : -1;
		if(Math.abs(this.scene.sprite[i].speed.x) > this.scene.sprite[i].speed.max.x) {
			this.scene.sprite[i].speed.x = this.scene.sprite[i].speed.max.x * sx;	
		}
		if(Math.abs(this.scene.sprite[i].speed.y) > this.scene.sprite[i].speed.max.y) {
			this.scene.sprite[i].speed.y = this.scene.sprite[i].speed.max.y * sy;
		}
		
		this.scene.sprite[i].speed.x -= this.scene.sprite[i].speed.gravity.x;
		this.scene.sprite[i].speed.y -= this.scene.sprite[i].speed.gravity.y;
		if(this.scene.sprite[i].affects.physics.gravity) {
			this.scene.sprite[i].speed.gravity.x += this.scene.physics.gravity.x;
			this.scene.sprite[i].speed.gravity.y += this.scene.physics.gravity.y;
		}
		this.scene.sprite[i].speed.x += this.scene.sprite[i].speed.gravity.x;
		this.scene.sprite[i].speed.y += this.scene.sprite[i].speed.gravity.y;
		
		
		this.scene.sprite[i].speed.x = parseFloat(this.scene.sprite[i].speed.x.toFixed(3));
		this.scene.sprite[i].speed.y = parseFloat(this.scene.sprite[i].speed.y.toFixed(3));
		this.scene.sprite[i].speed.t.x += this.scene.sprite[i].speed.x;
		this.scene.sprite[i].speed.t.y += this.scene.sprite[i].speed.y;
		this.scene.sprite[i].speed.t.x = parseFloat(this.scene.sprite[i].speed.t.x.toFixed(3));
		this.scene.sprite[i].speed.t.y = parseFloat(this.scene.sprite[i].speed.t.y.toFixed(3));
		this.scene.sprite[i].resetAcceleration();
		if(this.scene.sprite[i].speed.x === 0) {
			this.scene.sprite[i].speed.t.x = 0;
		}
		if(this.scene.sprite[i].speed.y === 0) {
			this.scene.sprite[i].speed.t.y = 0;
		}
	}
};

Game.prototype.updateMove = function() {
	var r = true;
	for(var i = 0; i < this.scene.sprite.length; i++) {
		var t = true;
		this.scene.sprite[i].speed.check.x = true;
		this.scene.sprite[i].speed.check.y = true;
		if(this.scene.sprite[i].speed.t.x >= 1) {
			this.scene.sprite[i].speed.t.x -= 1;
			this.scene.sprite[i].move.x = 1;
			t = false;
			r = false;
			this.scene.sprite[i].speed.check.x = false;
		} else if(this.scene.sprite[i].speed.t.x <= -1) {
			this.scene.sprite[i].speed.t.x += 1;
			this.scene.sprite[i].move.x = -1;
			t = false;
			r = false;
			this.scene.sprite[i].speed.check.x = false;
		}
		if(this.scene.sprite[i].speed.t.y >= 1) {
			this.scene.sprite[i].speed.t.y -= 1;
			this.scene.sprite[i].move.y = 1;
			t = false;
			r = false;
			this.scene.sprite[i].speed.check.y = false;
		} else if(this.scene.sprite[i].speed.t.y <= -1) {
			this.scene.sprite[i].speed.t.y += 1;
			this.scene.sprite[i].move.y = -1;
			t = false;
			r = false;
			this.scene.sprite[i].speed.check.y = false;
		}
		if(t) {
			if(this.scene.sprite[i].speed.t.x !== 0)
				this.scene.sprite[i].speed.t.x > 0 ? this.scene.sprite[i].move.x = 1 : this.scene.sprite[i].move.x = -1;
			if(this.scene.sprite[i].speed.t.y !== 0)
				this.scene.sprite[i].speed.t.y > 0 ? this.scene.sprite[i].move.y = 1 : this.scene.sprite[i].move.y = -1;
		}
	}
	return r;
};

Game.prototype.updateSpriteCollision = function() {
	for(var i = 0; i < this.scene.sprite.length; i++) {
		for(var j = 0; j < this.scene.sprite.length; j++) {
			if(i !== j) {
				var tjx = this.scene.sprite[j].move.x;
				var tjy = this.scene.sprite[j].move.y;
				if(j > i) {
					this.scene.sprite[j].move.x = 0;
					this.scene.sprite[j].move.y = 0;
				}
				if((this.scene.sprite[i].collides.sprite && this.scene.sprite[j].collidable && this.scene.sprite[i].collidable) && (this.scene.sprite[i].collidesWithSprite(this.scene.sprite[j]))) {
					var mc = 0;
					while(mc <= 2) {
						if(this.scene.sprite[i].move.x !== 0 || this.scene.sprite[i].move.y !== 0) {
							if(mc === 0 || mc === 2) {
								var tx = this.scene.sprite[i].move.x;
								this.scene.sprite[i].move.x = 0;
								if(this.scene.sprite[i].collidesWithSprite(this.scene.sprite[j])) {
									if(this.scene.sprite[i].move.y > 0) {
										this.scene.sprite[i].collision.sprite.down = true;
									}
									if(this.scene.sprite[i].move.y < 0) {
										this.scene.sprite[i].collision.sprite.up = true;
									}
									if(this.scene.sprite[i].collision.sprite.down && this.scene.physics.gravity.y > 0) {
										this.scene.sprite[i].speed.gravity.y = 0;
									}
									if(this.scene.sprite[i].collision.sprite.up && this.scene.physics.gravity.y < 0) {
										this.scene.sprite[i].speed.gravity.y = 0;
									}
									this.scene.sprite[i].collision.sprite.id = j;
									this.scene.sprite[i].move.y = 0;
									this.scene.sprite[i].speed.y = 0;
									this.scene.sprite[i].speed.t.y = 0;
								}
								this.scene.sprite[i].move.x = tx;
							}
							if(mc === 1 || mc === 2) {
								var ty = this.scene.sprite[i].move.y;
								if(mc !== 2)
									this.scene.sprite[i].move.y = 0;
								if(this.scene.sprite[i].collidesWithSprite(this.scene.sprite[j])) {
									if(this.scene.sprite[i].move.x > 0) {
										this.scene.sprite[i].collision.sprite.right = true;
									}
									if(this.scene.sprite[i].move.x < 0) {
										this.scene.sprite[i].collision.sprite.left = true;
									}
									if(this.scene.sprite[i].collision.sprite.left && this.scene.physics.gravity.x < 0) {
										this.scene.sprite[i].speed.gravity.x = 0;
									}
									if(this.scene.sprite[i].collision.sprite.right && this.scene.physics.gravity.x > 0) {
										this.scene.sprite[i].speed.gravity.x = 0;
									}
									this.scene.sprite[i].collision.sprite.id = j;
									this.scene.sprite[i].move.x = 0;
									this.scene.sprite[i].speed.x = 0;
									this.scene.sprite[i].speed.t.x = 0;
								}
								this.scene.sprite[i].move.y = ty;
							}
						}
						mc++;
					}
				}
				this.scene.sprite[j].move.x = tjx;
				this.scene.sprite[j].move.y = tjy;
			}
		}
	}
};

Game.prototype.updateMapCollision = function() {
	if(this.scene.map !== null) {
		for(var i = 0; i < this.scene.sprite.length; i++) {
			for(var j = 0; j < this.scene.map.layer.length; j++) {
				if(this.scene.map.layer[j].collidable && this.scene.sprite[i].collides.map) {
					var mc = 0;
					while(mc <= 2) {
						if(this.scene.sprite[i].move.x !== 0 || this.scene.sprite[i].move.y !== 0) {
							for(var k = 0; k <= Math.ceil((this.scene.sprite[i].frame.height - this.scene.sprite[i].frame.offset.height) / this.scene.map.tile.height); k++) {
								for(var l = 0; l <= Math.ceil((this.scene.sprite[i].frame.width - this.scene.sprite[i].frame.offset.width) / this.scene.map.tile.width); l++) {
									var tile = this.scene.map.getTile(this.scene.map.layer[j].name, this.scene.sprite[i].position.x - this.scene.sprite[i].anchor.x + this.scene.sprite[i].move.x + Math.abs(this.scene.map.layer[j].position.x) + (l * this.scene.map.tile.width), this.scene.sprite[i].position.y - this.scene.sprite[i].anchor.y + this.scene.sprite[i].move.y + Math.abs(this.scene.map.layer[j].position.y) + (k * this.scene.map.tile.height), this.scene.sprite[i].frame.width, this.scene.sprite[i].frame.height);
									if(tile !== null && this.scene.sprite[i].collidesWithTile(this.scene.map.layer[j], this.scene.map.layer[j].data[tile])) {
										if(mc === 0 || mc === 2) {
											var tx = this.scene.sprite[i].move.x;
											this.scene.sprite[i].move.x = 0;
											if(this.scene.sprite[i].collidesWithTile(this.scene.map.layer[j], this.scene.map.layer[j].data[tile])) {
												if(this.scene.sprite[i].move.y > 0) {
													this.scene.sprite[i].collision.map.down = true;
												}
												if(this.scene.sprite[i].move.y < 0) {
													this.scene.sprite[i].collision.map.up = true;
												}
												if(this.scene.sprite[i].collision.map.down && this.scene.physics.gravity.y > 0) {
													this.scene.sprite[i].speed.gravity.y = 0;
												}
												if(this.scene.sprite[i].collision.map.up && this.scene.physics.gravity.y < 0) {
													this.scene.sprite[i].speed.gravity.y = 0;
												}
												if((this.scene.sprite[i].collision.check.map.up && this.scene.sprite[i].collision.map.up) || (this.scene.sprite[i].collision.check.map.down && this.scene.sprite[i].collision.map.down)) {
													this.scene.sprite[i].move.y = 0;
													this.scene.sprite[i].speed.y = 0;
													this.scene.sprite[i].speed.t.y = 0;
												}
											}
											this.scene.sprite[i].move.x = tx;
										}
										if(mc === 1 || mc === 2) {
											var ty = this.scene.sprite[i].move.y;
											if(mc !== 2)
											this.scene.sprite[i].move.y = 0;
											if(this.scene.sprite[i].collidesWithTile(this.scene.map.layer[j], this.scene.map.layer[j].data[tile])) {
												if(this.scene.sprite[i].move.x > 0) {
													this.scene.sprite[i].collision.map.right = true;
												}
												if(this.scene.sprite[i].move.x < 0) {
													this.scene.sprite[i].collision.map.left = true;
												}
												if(this.scene.sprite[i].collision.map.left && this.scene.physics.gravity.x < 0) {
													this.scene.sprite[i].speed.gravity.x = 0;
												}
												if(this.scene.sprite[i].collision.map.right && this.scene.physics.gravity.x > 0) {
													this.scene.sprite[i].speed.gravity.x = 0;
												}
												if((!this.scene.sprite[i].collision.check.map.up && this.scene.sprite[i].collision.map.up) || (!this.scene.sprite[i].collision.check.map.down && this.scene.sprite[i].collision.map.down)) {
												} else {	
													if((this.scene.sprite[i].collision.check.map.left && this.scene.sprite[i].collision.map.left) || (this.scene.sprite[i].collision.check.map.right && this.scene.sprite[i].collision.map.right)) {
														this.scene.sprite[i].move.x = 0;
														this.scene.sprite[i].speed.x = 0;
														this.scene.sprite[i].speed.t.x = 0;
													}
												}
											}
											this.scene.sprite[i].move.y = ty;
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
};

Game.prototype.updateSpriteCollisionCheck = function() {
	for(var i = 0; i < this.scene.sprite.length; i++) {
		if(this.scene.sprite[i].speed.check.x && this.scene.sprite[i].speed.check.y) {
			this.scene.sprite[i].resetMove();
		}
	}
};

Game.prototype.update = function(_exit) {
	for(var i = 0; i < this.scene.sprite.length; i++) {
		this.scene.sprite[i].update();
		this.scene.sprite[i].flipUpdate();
		if(this.scene.sprite[i].animation !== null && _exit)
			this.scene.sprite[i].animation.nextFrame();
	}
	if(this.scene.map !== null)
		this.scene.map.update(this.canvas);
};

Game.prototype.checkBoundaries = function() {
	for(var i = 0; i < this.scene.sprite.length; i++) {
		if(this.scene.boundaries.x !== null) {
			if(this.scene.sprite[i].position.x - this.scene.sprite[i].anchor.x < this.scene.boundaries.x) {
				this.scene.sprite[i].position.x = this.scene.boundaries.x + this.scene.sprite[i].anchor.x;
			}
			if(this.scene.sprite[i].position.x + this.scene.sprite[i].frame.width - this.scene.sprite[i].anchor.x > this.scene.boundaries.x + this.scene.boundaries.width) {
				this.scene.sprite[i].position.x = this.scene.boundaries.x + this.scene.boundaries.width - this.scene.sprite[i].frame.width + this.scene.sprite[i].anchor.x;
			}
		}
		if(this.scene.boundaries.y !== null) {
			if(this.scene.sprite[i].position.y - this.scene.sprite[i].anchor.y < this.scene.boundaries.y) {
				this.scene.sprite[i].position.y = this.scene.boundaries.y + this.scene.sprite[i].anchor.y;
			}
			if(this.scene.sprite[i].position.y + this.scene.sprite[i].frame.height - this.scene.sprite[i].anchor.y > this.scene.boundaries.y + this.scene.boundaries.height) {
				this.scene.sprite[i].position.y = this.scene.boundaries.y + this.scene.boundaries.height - this.scene.sprite[i].frame.height + this.scene.sprite[i].anchor.y;
			}
		}
	}
};

Game.prototype.reset = function() {
	for(var i = 0; i < this.scene.sprite.length; i++) {
		this.scene.sprite[i].resetMove();
	}
	if(this.scene.map !== null)
		this.scene.map.resetScroll();
};

Game.prototype.draw = function() {
	this.contextMap.clearRect(0, 0, this.canvasMap.width, this.canvasMap.height);
	this.contextSprite.clearRect(0, 0, this.canvasSprite.width, this.canvasSprite.height);	
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);	
	if(this.scene.map !== null && this.scene.map.visible) {
		this.scene.map.draw();
	}
	for(var i = 0; i < this.scene.sprite.length; i++) {
		if(this.scene.sprite[i].visible) {
			this.scene.sprite[i].draw();
		}
	}
	this.contextMap.drawImage(this.canvasSprite, 0, 0);
	this.context.drawImage(this.canvasMap, 0, 0);
	for(var i = 0; i < this.scene.text.length; i++) {
		this.scene.text[i].draw();
	}
};

Game.prototype.removeSprite = function() {
	for(var i = this.scene.sprite.length - 1; i >= 0; i--) {
		if(this.scene.sprite[i].kill) {
			this.scene.sprite.splice(i, 1);
		}
	}
};

Game.prototype.play = function() {
	this.status = 1;
};

Game.prototype.stop = function() {
	this.status = 0;
};

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){window.setTimeout(callback, 1000 / 60)};
})();

window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
})();