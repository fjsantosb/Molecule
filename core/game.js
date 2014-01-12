var Game = function(_width, _height, _scale) {
	this.canvas = null;
	this.context = null;
	this.scale = null;
	this.scene = null;
	this.map = null;
	this.current = null;
	this.next = {scene: null, fade: null};
	this.sprite = new ImageFile(this);
	this.audio = new AudioFile(this);
	this.sound = new Array();
	this.input = new Input(this);
	this.physics = {gravity: {x: 0, y: 0}, friction: {x: 0, y: 0}};
	this.boundaries = {x: null, y: null, width: null, height: null};
	
	this.canvasSprite = null;
	this.contextSprite = null;
	this.canvasMap = null;
	this.contextMap = null;
	this.status = 1;
	
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('id', 'canvas');
	
	this.canvas.width = _width;
	this.canvas.height = _height;
	
	if(_scale === undefined) {
		_scale = 1;
	}
	this.canvas.style.width = _width * _scale + "px";
	this.canvas.style.height = _height * _scale + "px";
	this.context = this.canvas.getContext('2d');
	this.scale = _scale;
	
	document.body.appendChild(this.canvas);
	
	this.canvasSprite = document.createElement('canvas');
	this.contextSprite = this.canvasSprite.getContext('2d');
	this.canvasMap = document.createElement('canvas');
	this.contextMap = this.canvasMap.getContext('2d');
	
    this.canvasSprite.width = this.canvas.width;
    this.canvasSprite.height = this.canvas.height;
    this.canvasMap.width = this.canvas.width;
    this.canvasMap.height = this.canvas.height;
    
    this.scene = new Scene(this);
    this.map = this.scene.map;
	this.current = {scene: this.scene};
	
	this.scene.physics = this.physics;
	this.scene.boundaries = this.boundaries;
};

Game.prototype.start = function() {
	var self = this;
	var interval = setInterval(function(){self.loadResources(interval)}, 100);
};

Game.prototype.setScene = function(_scene) {
	this.current.scene = _scene;
};

Game.prototype.switchScene = function(_scene, _fade) {
	this.next.scene = _scene;
	this.next.fade = _fade;
};

Game.prototype.loadResources = function(_interval) {
	if(this.sprite.isLoaded() && this.audio.isLoaded()) {
		clearInterval(_interval);
		for(var i = 0; i < this.current.scene.sprite.length; i++) {
			this.current.scene.sprite[i].getAnimation(this);
		}
		this.setCamera();
		init();
		this.loop();
		this.draw();
	}
};

Game.prototype.setCamera = function() {
	if(this.current.scene.camera.type === 1) {
		_x = this.current.scene.camera.sprite.position.x;
		this.current.scene.camera.sprite.position.x = 0;
		_y = this.current.scene.camera.sprite.position.y;
		this.current.scene.camera.sprite.position.y = 0;
		for(var i = 0; i < _x; i++) {
			this.current.scene.camera.sprite.move.x = 1;
			this.current.scene.camera.update(this.current.scene.map, this.current.scene.sprite, this.canvas);
			this.update();
			this.reset();
		}
		
		for(var i = 0; i < _y; i++) {
			this.current.scene.camera.sprite.move.y = 1;
			this.current.scene.camera.update(this.current.scene.map, this.current.scene.sprite, this.canvas);
			this.update();
			this.reset();
		}
	}
};

Game.prototype.loop = function() {
	var self = this;
	this.removeSprite();
	update();
	this.updateTransitionScene();
	if(this.status == 1 && this.current.scene.status == 1) {
		var exit = false;
		this.updatePhysics();
		this.updateCollisionState();
		while(!exit) {
			exit = this.updateMove();
			this.updateMapCollision();
			this.updateSpriteCollision();
			this.updateSpriteCollisionCheck();
			if(this.current.scene.camera.type === 1) {
				this.current.scene.camera.update(this.current.scene.map, this.current.scene.sprite);
			}
			this.update(exit);
			this.checkBoundaries();
			this.reset();
		}
	}
	setTimeout(function(){self.loop()}, 1000 / 60);
};

Game.prototype.updateTransitionScene = function() {
	if(this.next.fade) {
		var transitionSpeed = 0.02;
		if(this.next.scene !== null) {
			var _alpha = this.context.globalAlpha;
			_alpha -= transitionSpeed;
			_alpha = parseFloat(_alpha.toFixed(3));
			this.context.globalAlpha = _alpha;
			if(this.context.globalAlpha <= 0.00) {
				this.context.globalAlpha = 0;
				this.current.scene = this.next.scene;
				this.next.scene = null;
			}
		}
		if(this.next.scene == null && this.context.globalAlpha < 1) {
			var _alpha = this.context.globalAlpha;
			_alpha += transitionSpeed;
			_alpha = parseFloat(_alpha.toFixed(3));
			this.context.globalAlpha = _alpha;
			this.context.globalAlpha = parseFloat(this.context.globalAlpha.toFixed(3));
			if(this.context.globalAlpha >= 1.00) {
				this.context.globalAlpha = 1;
			}
		}
	} else {
		if(this.next.scene !== null) {
			this.current.scene = this.next.scene;
			this.next.scene = null;
		}
	}
};

Game.prototype.updateCollisionState = function() {
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		this.current.scene.sprite[i].collision.sprite.left = false;
		this.current.scene.sprite[i].collision.sprite.right = false;
		this.current.scene.sprite[i].collision.sprite.up = false;
		this.current.scene.sprite[i].collision.sprite.down = false;
		
		this.current.scene.sprite[i].collision.map.left = false;
		this.current.scene.sprite[i].collision.map.right = false;
		this.current.scene.sprite[i].collision.map.up = false;
		this.current.scene.sprite[i].collision.map.down = false;
	}
};

Game.prototype.updatePhysics = function() {
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		if(this.current.scene.sprite[i].affects.physics.gravity) {
			this.current.scene.sprite[i].speed.gravity.x += this.current.scene.physics.gravity.x;
			this.current.scene.sprite[i].speed.gravity.y += this.current.scene.physics.gravity.y;
		}
		
		if(this.current.scene.sprite[i].affects.physics.friction) {
			if(this.current.scene.sprite[i].speed.x > 0) {
				this.current.scene.sprite[i].speed.x = this.current.scene.sprite[i].speed.x * (1 - this.current.scene.physics.friction.x);
				if(this.current.scene.sprite[i].speed.x < 0.05) {
					this.current.scene.sprite[i].speed.x = 0;
				}
			} else if(this.current.scene.sprite[i].speed.x < 0) {
				this.current.scene.sprite[i].speed.x = this.current.scene.sprite[i].speed.x * (1 - this.current.scene.physics.friction.x);
				if(this.current.scene.sprite[i].speed.x > 0.05) {
					this.current.scene.sprite[i].speed.x = 0;
				}
			}
			if(this.current.scene.sprite[i].speed.y > 0) {
				this.current.scene.sprite[i].speed.y = this.current.scene.sprite[i].speed.y * (1 - this.current.scene.physics.friction.y);
				if(this.current.scene.sprite[i].speed.y < 0.05) {
					this.current.scene.sprite[i].speed.y = 0;
				}
			} else if(this.current.scene.sprite[i].speed.y < 0) {
				this.current.scene.sprite[i].speed.y = this.current.scene.sprite[i].speed.y * (1 - this.current.scene.physics.friction.y);
				if(this.current.scene.sprite[i].speed.y > 0.05) {
					this.current.scene.sprite[i].speed.y = 0;
				}
			}
		}
		
		if(this.current.scene.sprite[i].affects.physics.gravity && this.current.scene.physics.gravity.y > 0 && this.current.scene.sprite[i].collision.sprite.down && this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].platform) {
			if(this.current.scene.sprite[i].speed.x >= 0 && this.current.scene.sprite[i].speed.x < this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.x) {
				this.current.scene.sprite[i].speed.x = this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.x;
			} else if(this.current.scene.sprite[i].speed.x <= 0 && this.current.scene.sprite[i].speed.x > this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.x) {
				this.current.scene.sprite[i].speed.x = this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.x;
			}
		} else if(this.current.scene.sprite[i].affects.physics.gravity && this.current.scene.physics.gravity.y < 0 && this.current.scene.sprite[i].collision.sprite.up && this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].platform) {
			if(this.current.scene.sprite[i].speed.x >= 0 && this.current.scene.sprite[i].speed.x < this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.x) {
				this.current.scene.sprite[i].speed.x = this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.x;
			} else if(this.current.scene.sprite[i].speed.x <= 0 && this.current.scene.sprite[i].speed.x > this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.x) {
				this.current.scene.sprite[i].speed.x = this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.x;
			}
		} else if(this.current.scene.sprite[i].affects.physics.gravity && this.current.scene.physics.gravity.x > 0 && this.current.scene.sprite[i].collision.sprite.right && this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].platform) {
			if(this.current.scene.sprite[i].speed.y >= 0 && this.current.scene.sprite[i].speed.y < this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.y) {
				this.current.scene.sprite[i].speed.y = this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.y;
			} else if(this.current.scene.sprite[i].speed.y <= 0 && this.current.scene.sprite[i].speed.y > this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.y) {
				this.current.scene.sprite[i].speed.y = this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.y;
			}
		} else if(this.current.scene.sprite[i].affects.physics.gravity && this.current.scene.physics.gravity.x < 0 && this.current.scene.sprite[i].collision.sprite.left && this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].platform) {
			if(this.current.scene.sprite[i].speed.y >= 0 && this.current.scene.sprite[i].speed.y < this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.y) {
				this.current.scene.sprite[i].speed.y = this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.y;
			} else if(this.current.scene.sprite[i].speed.y <= 0 && this.current.scene.sprite[i].speed.y > this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.y) {
				this.current.scene.sprite[i].speed.y = this.current.scene.sprite[this.current.scene.sprite[i].collision.sprite.id].speed.y;
			}
		}
		
		this.current.scene.sprite[i].speed.x += this.current.scene.sprite[i].acceleration.x;
		this.current.scene.sprite[i].speed.y += this.current.scene.sprite[i].acceleration.y;
		var sx = this.current.scene.sprite[i].speed.x >= 0 ? 1 : -1;
		var sy = this.current.scene.sprite[i].speed.y >= 0 ? 1 : -1;
		if(Math.abs(this.current.scene.sprite[i].speed.x) > this.current.scene.sprite[i].speed.max.x) {
			this.current.scene.sprite[i].speed.x = this.current.scene.sprite[i].speed.max.x * sx;	
		}
		if(Math.abs(this.current.scene.sprite[i].speed.y) > this.current.scene.sprite[i].speed.max.y) {
			this.current.scene.sprite[i].speed.y = this.current.scene.sprite[i].speed.max.y * sy;
		}
		
		this.current.scene.sprite[i].speed.x += this.current.scene.sprite[i].speed.gravity.x;
		this.current.scene.sprite[i].speed.y += this.current.scene.sprite[i].speed.gravity.y; 
		
		this.current.scene.sprite[i].speed.x = parseFloat(this.current.scene.sprite[i].speed.x.toFixed(3));
		this.current.scene.sprite[i].speed.y = parseFloat(this.current.scene.sprite[i].speed.y.toFixed(3));
		this.current.scene.sprite[i].speed.t.x += this.current.scene.sprite[i].speed.x;
		this.current.scene.sprite[i].speed.t.y += this.current.scene.sprite[i].speed.y;
		this.current.scene.sprite[i].speed.t.x = parseFloat(this.current.scene.sprite[i].speed.t.x.toFixed(3));
		this.current.scene.sprite[i].speed.t.y = parseFloat(this.current.scene.sprite[i].speed.t.y.toFixed(3));
		this.current.scene.sprite[i].resetAcceleration();
		if(this.current.scene.sprite[i].speed.x === 0) {
			this.current.scene.sprite[i].speed.t.x = 0;
		}
		if(this.current.scene.sprite[i].speed.y === 0) {
			this.current.scene.sprite[i].speed.t.y = 0;
		}
		
		this.current.scene.sprite[i].speed.x -= this.current.scene.sprite[i].speed.gravity.x;
		this.current.scene.sprite[i].speed.y -= this.current.scene.sprite[i].speed.gravity.y; 
	}
};

Game.prototype.updateMove = function() {
	var r = true;
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		var t = true;
		this.current.scene.sprite[i].speed.check.x = true;
		this.current.scene.sprite[i].speed.check.y = true;
		if(this.current.scene.sprite[i].speed.t.x >= 1) {
			this.current.scene.sprite[i].speed.t.x -= 1;
			this.current.scene.sprite[i].move.x = 1;
			t = false;
			r = false;
			this.current.scene.sprite[i].speed.check.x = false;
		} else if(this.current.scene.sprite[i].speed.t.x <= -1) {
			this.current.scene.sprite[i].speed.t.x += 1;
			this.current.scene.sprite[i].move.x = -1;
			t = false;
			r = false;
			this.current.scene.sprite[i].speed.check.x = false;
		}
		if(this.current.scene.sprite[i].speed.t.y >= 1) {
			this.current.scene.sprite[i].speed.t.y -= 1;
			this.current.scene.sprite[i].move.y = 1;
			t = false;
			r = false;
			this.current.scene.sprite[i].speed.check.y = false;
		} else if(this.current.scene.sprite[i].speed.t.y <= -1) {
			this.current.scene.sprite[i].speed.t.y += 1;
			this.current.scene.sprite[i].move.y = -1;
			t = false;
			r = false;
			this.current.scene.sprite[i].speed.check.y = false;
		}
		if(t) {
			if(this.current.scene.sprite[i].speed.t.x !== 0)
				this.current.scene.sprite[i].speed.t.x > 0 ? this.current.scene.sprite[i].move.x = 1 : this.current.scene.sprite[i].move.x = -1;
			if(this.current.scene.sprite[i].speed.t.y !== 0)
				this.current.scene.sprite[i].speed.t.y > 0 ? this.current.scene.sprite[i].move.y = 1 : this.current.scene.sprite[i].move.y = -1;
		}
	}
	return r;
};

Game.prototype.updateSpriteCollision = function() {
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		for(var j = 0; j < this.current.scene.sprite.length; j++) {
			if(i !== j) {
				var tjx = this.current.scene.sprite[j].move.x;
				var tjy = this.current.scene.sprite[j].move.y;
				if(j > i) {
					this.current.scene.sprite[j].move.x = 0;
					this.current.scene.sprite[j].move.y = 0;
				}
				if((this.current.scene.sprite[i].collides.sprite && this.current.scene.sprite[j].collidable) && (this.current.scene.sprite[i].collidesWithSprite(this.current.scene.sprite[j]))) {
					var mc = 0;
					while(mc <= 2) {
						if(this.current.scene.sprite[i].move.x !== 0 || this.current.scene.sprite[i].move.y !== 0) {
							if(mc === 0 || mc === 2) {
								var tx = this.current.scene.sprite[i].move.x;
								this.current.scene.sprite[i].move.x = 0;
								if(this.current.scene.sprite[i].collidesWithSprite(this.current.scene.sprite[j])) {
									if(this.current.scene.sprite[i].move.y > 0) {
										this.current.scene.sprite[i].collision.sprite.down = true;
									}
									if(this.current.scene.sprite[i].move.y < 0) {
										this.current.scene.sprite[i].collision.sprite.up = true;
									}
									if(this.current.scene.sprite[i].collision.sprite.down && this.current.scene.physics.gravity.y > 0) {
										this.current.scene.sprite[i].speed.gravity.y = 0;
									}
									if(this.current.scene.sprite[i].collision.sprite.up && this.current.scene.physics.gravity.y < 0) {
										this.current.scene.sprite[i].speed.gravity.y = 0;
									}
									this.current.scene.sprite[i].collision.sprite.id = j;
									this.current.scene.sprite[i].move.y = 0;
									this.current.scene.sprite[i].speed.y = 0;
									this.current.scene.sprite[i].speed.t.y = 0;
								}
								this.current.scene.sprite[i].move.x = tx;
							}
							if(mc === 1 || mc === 2) {
								var ty = this.current.scene.sprite[i].move.y;
								if(mc !== 2)
									this.current.scene.sprite[i].move.y = 0;
								if(this.current.scene.sprite[i].collidesWithSprite(this.current.scene.sprite[j])) {
									if(this.current.scene.sprite[i].move.x > 0) {
										this.current.scene.sprite[i].collision.sprite.right = true;
									}
									if(this.current.scene.sprite[i].move.x < 0) {
										this.current.scene.sprite[i].collision.sprite.left = true;
									}
									if(this.current.scene.sprite[i].collision.sprite.left && this.current.scene.physics.gravity.x < 0) {
										this.current.scene.sprite[i].speed.gravity.x = 0;
									}
									if(this.current.scene.sprite[i].collision.sprite.right && this.current.scene.physics.gravity.x > 0) {
										this.current.scene.sprite[i].speed.gravity.x = 0;
									}
									this.current.scene.sprite[i].collision.sprite.id = j;
									this.current.scene.sprite[i].move.x = 0;
									this.current.scene.sprite[i].speed.x = 0;
									this.current.scene.sprite[i].speed.t.x = 0;
								}
								this.current.scene.sprite[i].move.y = ty;
							}
						}
						mc++;
					}
				}
				this.current.scene.sprite[j].move.x = tjx;
				this.current.scene.sprite[j].move.y = tjy;
			}
		}
	}
};

Game.prototype.updateMapCollision = function() {
	if(this.current.scene.map !== null) {
		for(var i = 0; i < this.current.scene.sprite.length; i++) {
			for(var j = 0; j < this.current.scene.map.layer.length; j++) {
				if(this.current.scene.map.layer[j].collidable && this.current.scene.sprite[i].collides.map) {
					var mc = 0;
					while(mc <= 2) {
						if(this.current.scene.sprite[i].move.x !== 0 || this.current.scene.sprite[i].move.y !== 0) {
							for(var k = 0; k <= Math.ceil((this.current.scene.sprite[i].frame.height - this.current.scene.sprite[i].frame.offset.height) / this.current.scene.map.tile.height); k++) {
								for(var l = 0; l <= Math.ceil((this.current.scene.sprite[i].frame.width - this.current.scene.sprite[i].frame.offset.width) / this.current.scene.map.tile.width); l++) {
									var tile = this.current.scene.map.getTile(this.current.scene.map.layer[j], this.current.scene.sprite[i].position.x - this.current.scene.sprite[i].anchor.x + this.current.scene.sprite[i].position.offset.x + this.current.scene.sprite[i].move.x + Math.abs(this.current.scene.map.layer[j].position.x) + (l * this.current.scene.map.tile.width), this.current.scene.sprite[i].position.y - this.current.scene.sprite[i].anchor.y + this.current.scene.sprite[i].position.offset.y + this.current.scene.sprite[i].move.y + Math.abs(this.current.scene.map.layer[j].position.y) + (k * this.current.scene.map.tile.height), this.current.scene.sprite[i].frame.width, this.current.scene.sprite[i].frame.height);
									if(tile === null || tile >= this.current.scene.map.layer[j].data.length || tile < 0) {
										tile = null;
										//this.current.scene.sprite[i].kill = true;
									}
									if(tile !== null && this.current.scene.sprite[i].collidesWithTile(this.current.scene.map.layer[j], this.current.scene.map.layer[j].data[tile])) {
										if(mc === 0 || mc === 2) {
											var tx = this.current.scene.sprite[i].move.x;
											this.current.scene.sprite[i].move.x = 0;
											if(this.current.scene.sprite[i].collidesWithTile(this.current.scene.map.layer[j], this.current.scene.map.layer[j].data[tile])) {
												if(this.current.scene.sprite[i].move.y > 0) {
													this.current.scene.sprite[i].collision.map.down = true;
												}
												if(this.current.scene.sprite[i].move.y < 0) {
													this.current.scene.sprite[i].collision.map.up = true;
												}
												if(this.current.scene.sprite[i].collision.map.down && this.current.scene.physics.gravity.y > 0) {
													this.current.scene.sprite[i].speed.gravity.y = 0;
												}
												if(this.current.scene.sprite[i].collision.map.up && this.current.scene.physics.gravity.y < 0) {
													this.current.scene.sprite[i].speed.gravity.y = 0;
												}
												if((this.current.scene.sprite[i].checkCollision.map.up && this.current.scene.sprite[i].collision.map.up) || (this.current.scene.sprite[i].checkCollision.map.down && this.current.scene.sprite[i].collision.map.down)) {
													this.current.scene.sprite[i].move.y = 0;
													this.current.scene.sprite[i].speed.y = 0;
													this.current.scene.sprite[i].speed.t.y = 0;
												}
											}
											this.current.scene.sprite[i].move.x = tx;
										}
										if(mc === 1 || mc === 2) {
											var ty = this.current.scene.sprite[i].move.y;
											if(mc !== 2)
											this.current.scene.sprite[i].move.y = 0;
											if(this.current.scene.sprite[i].collidesWithTile(this.current.scene.map.layer[j], this.current.scene.map.layer[j].data[tile])) {
												if(this.current.scene.sprite[i].move.x > 0) {
													this.current.scene.sprite[i].collision.map.right = true;
												}
												if(this.current.scene.sprite[i].move.x < 0) {
													this.current.scene.sprite[i].collision.map.left = true;
												}
												if(this.current.scene.sprite[i].collision.map.left && this.current.scene.physics.gravity.x < 0) {
													this.current.scene.sprite[i].speed.gravity.x = 0;
												}
												if(this.current.scene.sprite[i].collision.map.right && this.current.scene.physics.gravity.x > 0) {
													this.current.scene.sprite[i].speed.gravity.x = 0;
												}
												if((!this.current.scene.sprite[i].checkCollision.map.up && this.current.scene.sprite[i].collision.map.up) || (!this.current.scene.sprite[i].checkCollision.map.down && this.current.scene.sprite[i].collision.map.down)) {
												} else {	
													if((this.current.scene.sprite[i].checkCollision.map.left && this.current.scene.sprite[i].collision.map.left) || (this.current.scene.sprite[i].checkCollision.map.right && this.current.scene.sprite[i].collision.map.right)) {
														this.current.scene.sprite[i].move.x = 0;
														this.current.scene.sprite[i].speed.x = 0;
														this.current.scene.sprite[i].speed.t.x = 0;
													}
												}
											}
											this.current.scene.sprite[i].move.y = ty;
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
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		if(this.current.scene.sprite[i].speed.check.x && this.current.scene.sprite[i].speed.check.y) {
			this.current.scene.sprite[i].resetMove();
		}
	}
};

Game.prototype.update = function(_exit) {
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		this.current.scene.sprite[i].update();
		this.current.scene.sprite[i].flipUpdate();
		if(this.current.scene.sprite[i].animation !== null && _exit)
			this.current.scene.sprite[i].animation.nextFrame();
	}
	if(this.current.scene.map !== null)
		this.current.scene.map.update(this.canvas);
};

Game.prototype.checkBoundaries = function() {
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		if(this.current.scene.boundaries.x !== null) {
			if(this.current.scene.sprite[i].position.x - this.current.scene.sprite[i].anchor.x < this.current.scene.boundaries.x) {
				this.current.scene.sprite[i].position.x = this.current.scene.boundaries.x + this.current.scene.sprite[i].anchor.x;
			}
			if(this.current.scene.sprite[i].position.x + this.current.scene.sprite[i].frame.width - this.current.scene.sprite[i].anchor.x > this.current.scene.boundaries.x + this.current.scene.boundaries.width) {
				this.current.scene.sprite[i].position.x = this.current.scene.boundaries.x + this.current.scene.boundaries.width - this.current.scene.sprite[i].frame.width + this.current.scene.sprite[i].anchor.x;
			}
		}
		if(this.current.scene.boundaries.y !== null) {
			if(this.current.scene.sprite[i].position.y - this.current.scene.sprite[i].anchor.y < this.current.scene.boundaries.y) {
				this.current.scene.sprite[i].position.y = this.current.scene.boundaries.y + this.current.scene.sprite[i].anchor.y;
			}
			if(this.current.scene.sprite[i].position.y + this.current.scene.sprite[i].frame.height - this.current.scene.sprite[i].anchor.y > this.current.scene.boundaries.y + this.current.scene.boundaries.height) {
				this.current.scene.sprite[i].position.y = this.current.scene.boundaries.y + this.current.scene.boundaries.height - this.current.scene.sprite[i].frame.height + this.current.scene.sprite[i].anchor.y;
			}
		}
	}
};

Game.prototype.reset = function() {
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		this.current.scene.sprite[i].resetMove();
	}
	if(this.current.scene.map !== null)
		this.current.scene.map.resetScroll();
};

Game.prototype.draw = function() {
	var self = this;
	this.contextMap.clearRect(0, 0, this.canvasMap.width, this.canvasMap.height);
	this.contextSprite.clearRect(0, 0, this.canvasSprite.width, this.canvasSprite.height);	
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);	
	if(this.current.scene.map !== null && this.current.scene.map.visible) {
		this.current.scene.map.draw();
	}
	for(var i = 0; i < this.current.scene.sprite.length; i++) {
		if(this.current.scene.sprite[i].visible) {
			this.current.scene.sprite[i].draw();
		}
	}
	this.contextMap.drawImage(this.canvasSprite, 0, 0);
	this.context.drawImage(this.canvasMap, 0, 0);
	requestAnimFrame(function(){self.draw()});
};

Game.prototype.removeSprite = function() {
	for(var i = this.current.scene.sprite.length - 1; i >= 0; i--) {
		if(this.current.scene.sprite[i].kill) {
			this.current.scene.sprite.splice(i, 1);
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