var Game = new function() {
	this.canvas = null;
	this.context = null;
	this.scale = null;
	this.scene = null;
	this.current = null;
	this.next = {scene: null, fade: null};
	this.imageFile = null;
	this.audioFile = null;
	this.sound = new Array();
	this.input = null;
	this.physics = {gravity: {x: 0, y: 0}, friction: {x: 0, y: 0}};
	
	this.canvasSprite = null;
	this.contextSprite = null;
	this.canvasMap = null;
	this.contextMap = null;
	this.status = 1;
	
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('id', 'canvas');
	
	this.create = function(_width, _height, _scale) {
		Game.canvas.width = _width;
		Game.canvas.height = _height;
		
		if(_scale === undefined) {
			_scale = 1;
		}
		Game.canvas.style.width = _width * _scale + "px";
		Game.canvas.style.height = _height * _scale + "px";
		Game.context = Game.canvas.getContext('2d');
		Game.scale = _scale;
		
		document.body.appendChild(Game.canvas);
		
		Game.canvasSprite = document.createElement('canvas');
		Game.contextSprite = Game.canvasSprite.getContext('2d');
		Game.canvasMap = document.createElement('canvas');
		Game.contextMap = Game.canvasMap.getContext('2d');
		
	    Game.canvasSprite.width = Game.canvas.width;
	    Game.canvasSprite.height = Game.canvas.height;
	    Game.canvasMap.width = Game.canvas.width;
	    Game.canvasMap.height = Game.canvas.height;
	    
	    this.scene = new Scene();
		this.current = {scene: this.scene};
		
		this.scene.physics = this.physics;
		
		this.imageFile = new ImageFile();
		this.audioFile = new AudioFile();
		
		this.input = new Input();
	};
	
	this.start = function() {
		var interval = setInterval(function(){Game.loadResources(interval)}, 100);
	};

	this.addScene = function(_scene) {
		Game.scene.push(_scene);
	};
	
	this.setScene = function(_scene) {
		Game.current.scene = _scene;
	};
	
	this.switchScene = function(_scene, _fade) {
		Game.next.scene = _scene;
		Game.next.fade = _fade;
	};
	
	this.loadResources = function(_interval) {
		if(Game.imageFile.isLoaded() && Game.audioFile.isLoaded()) {
			clearInterval(_interval);
			this.setCamera();
			init();
			this.loop();
			this.draw();
		}
	};
	
	this.setCamera = function() {
		if(Game.current.scene.camera.type === 1) {
			_x = Game.current.scene.camera.sprite.position.x;
			Game.current.scene.camera.sprite.position.x = 0;
			_y = Game.current.scene.camera.sprite.position.y;
			Game.current.scene.camera.sprite.position.y = 0;
			for(var i = 0; i < _x; i++) {
				Game.current.scene.camera.sprite.move.x = 1;
				Game.current.scene.camera.update(Game.current.scene.map, Game.current.scene.sprite, Game.canvas);
				this.update();
				this.reset();
			}
			
			for(var i = 0; i < _y; i++) {
				Game.current.scene.camera.sprite.move.y = 1;
				Game.current.scene.camera.update(Game.current.scene.map, Game.current.scene.sprite, Game.canvas);
				this.update();
				this.reset();
			}
		}
	};
	
	this.loop = function() {
		this.removeSprite();
		update();
		this.updateTransitionScene();
		if(Game.status == 1 && Game.current.scene.status == 1) {
			var exit = false;
			this.updatePhysics();
			this.updateCollisionState();
			while(!exit) {
				exit = this.updateMove();
				this.updateMapCollision();
				this.updateSpriteCollision();
				this.updateSpriteCollisionCheck();
				if(Game.current.scene.camera.type === 1) {
					Game.current.scene.camera.update(Game.current.scene.map, Game.current.scene.sprite);
				}
				this.update(exit);
				this.checkBoundaries();
				this.reset();
			}
		}
		setTimeout(function(){Game.loop()}, 1000 / 60);
	};
	
	this.updateTransitionScene = function() {
		if(Game.next.fade) {
			var transitionSpeed = 0.02;
			if(Game.next.scene !== null) {
				var _alpha = Game.context.globalAlpha;
				_alpha -= transitionSpeed;
				_alpha = parseFloat(_alpha.toFixed(3));
				Game.context.globalAlpha = _alpha;
				if(Game.context.globalAlpha <= 0.00) {
					Game.context.globalAlpha = 0;
					Game.current.scene = Game.next.scene;
					Game.next.scene = null;
				}
			}
			if(Game.next.scene == null && Game.context.globalAlpha < 1) {
				var _alpha = Game.context.globalAlpha;
				_alpha += transitionSpeed;
				_alpha = parseFloat(_alpha.toFixed(3));
				Game.context.globalAlpha = _alpha;
				Game.context.globalAlpha = parseFloat(Game.context.globalAlpha.toFixed(3));
				if(Game.context.globalAlpha >= 1.00) {
					Game.context.globalAlpha = 1;
				}
			}
		} else {
			if(Game.next.scene !== null) {
				Game.current.scene = Game.next.scene;
				Game.next.scene = null;
			}
		}
	};
	
	this.updateCollisionState = function() {
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			Game.current.scene.sprite[i].collision.sprite.left = false;
			Game.current.scene.sprite[i].collision.sprite.right = false;
			Game.current.scene.sprite[i].collision.sprite.up = false;
			Game.current.scene.sprite[i].collision.sprite.down = false;
			
			Game.current.scene.sprite[i].collision.map.left = false;
			Game.current.scene.sprite[i].collision.map.right = false;
			Game.current.scene.sprite[i].collision.map.up = false;
			Game.current.scene.sprite[i].collision.map.down = false;
		}
	};
	
	this.updatePhysics = function() {
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			if(Game.current.scene.sprite[i].affects.physics.gravity) {
				Game.current.scene.sprite[i].speed.gravity.x += Game.current.scene.physics.gravity.x;
				Game.current.scene.sprite[i].speed.gravity.y += Game.current.scene.physics.gravity.y;
			}
			
			if(Game.current.scene.sprite[i].affects.physics.friction) {
				if(Game.current.scene.sprite[i].speed.x > 0) {
					Game.current.scene.sprite[i].speed.x = Game.current.scene.sprite[i].speed.x * (1 - Game.current.scene.physics.friction.x);
					if(Game.current.scene.sprite[i].speed.x < 0.05) {
						Game.current.scene.sprite[i].speed.x = 0;
					}
				} else if(Game.current.scene.sprite[i].speed.x < 0) {
					Game.current.scene.sprite[i].speed.x = Game.current.scene.sprite[i].speed.x * (1 - Game.current.scene.physics.friction.x);
					if(Game.current.scene.sprite[i].speed.x > 0.05) {
						Game.current.scene.sprite[i].speed.x = 0;
					}
				}
				if(Game.current.scene.sprite[i].speed.y > 0) {
					Game.current.scene.sprite[i].speed.y = Game.current.scene.sprite[i].speed.y * (1 - Game.current.scene.physics.friction.y);
					if(Game.current.scene.sprite[i].speed.y < 0.05) {
						Game.current.scene.sprite[i].speed.y = 0;
					}
				} else if(Game.current.scene.sprite[i].speed.y < 0) {
					Game.current.scene.sprite[i].speed.y = Game.current.scene.sprite[i].speed.y * (1 - Game.current.scene.physics.friction.y);
					if(Game.current.scene.sprite[i].speed.y > 0.05) {
						Game.current.scene.sprite[i].speed.y = 0;
					}
				}
			}
			
			if(Game.current.scene.sprite[i].affects.physics.gravity && Game.current.scene.physics.gravity.y > 0 && Game.current.scene.sprite[i].collision.sprite.down && Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].platform) {
				if(Game.current.scene.sprite[i].speed.x >= 0 && Game.current.scene.sprite[i].speed.x < Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.x) {
					Game.current.scene.sprite[i].speed.x = Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.x;
				} else if(Game.current.scene.sprite[i].speed.x <= 0 && Game.current.scene.sprite[i].speed.x > Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.x) {
					Game.current.scene.sprite[i].speed.x = Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.x;
				}
			} else if(Game.current.scene.sprite[i].affects.physics.gravity && Game.current.scene.physics.gravity.y < 0 && Game.current.scene.sprite[i].collision.sprite.up && Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].platform) {
				if(Game.current.scene.sprite[i].speed.x >= 0 && Game.current.scene.sprite[i].speed.x < Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.x) {
					Game.current.scene.sprite[i].speed.x = Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.x;
				} else if(Game.current.scene.sprite[i].speed.x <= 0 && Game.current.scene.sprite[i].speed.x > Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.x) {
					Game.current.scene.sprite[i].speed.x = Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.x;
				}
			} else if(Game.current.scene.sprite[i].affects.physics.gravity && Game.current.scene.physics.gravity.x > 0 && Game.current.scene.sprite[i].collision.sprite.right && Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].platform) {
				if(Game.current.scene.sprite[i].speed.y >= 0 && Game.current.scene.sprite[i].speed.y < Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.y) {
					Game.current.scene.sprite[i].speed.y = Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.y;
				} else if(Game.current.scene.sprite[i].speed.y <= 0 && Game.current.scene.sprite[i].speed.y > Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.y) {
					Game.current.scene.sprite[i].speed.y = Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.y;
				}
			} else if(Game.current.scene.sprite[i].affects.physics.gravity && Game.current.scene.physics.gravity.x < 0 && Game.current.scene.sprite[i].collision.sprite.left && Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].platform) {
				if(Game.current.scene.sprite[i].speed.y >= 0 && Game.current.scene.sprite[i].speed.y < Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.y) {
					Game.current.scene.sprite[i].speed.y = Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.y;
				} else if(Game.current.scene.sprite[i].speed.y <= 0 && Game.current.scene.sprite[i].speed.y > Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.y) {
					Game.current.scene.sprite[i].speed.y = Game.current.scene.sprite[Game.current.scene.sprite[i].collision.sprite.id].speed.y;
				}
			}
			
			Game.current.scene.sprite[i].speed.x += Game.current.scene.sprite[i].acceleration.x;
			Game.current.scene.sprite[i].speed.y += Game.current.scene.sprite[i].acceleration.y;
			var sx = Game.current.scene.sprite[i].speed.x >= 0 ? 1 : -1;
			var sy = Game.current.scene.sprite[i].speed.y >= 0 ? 1 : -1;
			if(Math.abs(Game.current.scene.sprite[i].speed.x) > Game.current.scene.sprite[i].speed.max.x) {
				Game.current.scene.sprite[i].speed.x = Game.current.scene.sprite[i].speed.max.x * sx;	
			}
			if(Math.abs(Game.current.scene.sprite[i].speed.y) > Game.current.scene.sprite[i].speed.max.y) {
				Game.current.scene.sprite[i].speed.y = Game.current.scene.sprite[i].speed.max.y * sy;
			}
			
			Game.current.scene.sprite[i].speed.x += Game.current.scene.sprite[i].speed.gravity.x;
			Game.current.scene.sprite[i].speed.y += Game.current.scene.sprite[i].speed.gravity.y; 
			
			Game.current.scene.sprite[i].speed.x = parseFloat(Game.current.scene.sprite[i].speed.x.toFixed(3));
			Game.current.scene.sprite[i].speed.y = parseFloat(Game.current.scene.sprite[i].speed.y.toFixed(3));
			Game.current.scene.sprite[i].speed.t.x += Game.current.scene.sprite[i].speed.x;
			Game.current.scene.sprite[i].speed.t.y += Game.current.scene.sprite[i].speed.y;
			Game.current.scene.sprite[i].speed.t.x = parseFloat(Game.current.scene.sprite[i].speed.t.x.toFixed(3));
			Game.current.scene.sprite[i].speed.t.y = parseFloat(Game.current.scene.sprite[i].speed.t.y.toFixed(3));
			Game.current.scene.sprite[i].resetAcceleration();
			if(Game.current.scene.sprite[i].speed.x === 0) {
				Game.current.scene.sprite[i].speed.t.x = 0;
			}
			if(Game.current.scene.sprite[i].speed.y === 0) {
				Game.current.scene.sprite[i].speed.t.y = 0;
			}
			
			Game.current.scene.sprite[i].speed.x -= Game.current.scene.sprite[i].speed.gravity.x;
			Game.current.scene.sprite[i].speed.y -= Game.current.scene.sprite[i].speed.gravity.y; 
		}
	};
	
	this.updateMove = function() {
		var r = true;
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			var t = true;
			Game.current.scene.sprite[i].speed.check.x = true;
			Game.current.scene.sprite[i].speed.check.y = true;
			if(Game.current.scene.sprite[i].speed.t.x >= 1) {
				Game.current.scene.sprite[i].speed.t.x -= 1;
				Game.current.scene.sprite[i].move.x = 1;
				t = false;
				r = false;
				Game.current.scene.sprite[i].speed.check.x = false;
			} else if(Game.current.scene.sprite[i].speed.t.x <= -1) {
				Game.current.scene.sprite[i].speed.t.x += 1;
				Game.current.scene.sprite[i].move.x = -1;
				t = false;
				r = false;
				Game.current.scene.sprite[i].speed.check.x = false;
			}
			if(Game.current.scene.sprite[i].speed.t.y >= 1) {
				Game.current.scene.sprite[i].speed.t.y -= 1;
				Game.current.scene.sprite[i].move.y = 1;
				t = false;
				r = false;
				Game.current.scene.sprite[i].speed.check.y = false;
			} else if(Game.current.scene.sprite[i].speed.t.y <= -1) {
				Game.current.scene.sprite[i].speed.t.y += 1;
				Game.current.scene.sprite[i].move.y = -1;
				t = false;
				r = false;
				Game.current.scene.sprite[i].speed.check.y = false;
			}
			if(t) {
				if(Game.current.scene.sprite[i].speed.t.x !== 0)
					Game.current.scene.sprite[i].speed.t.x > 0 ? Game.current.scene.sprite[i].move.x = 1 : Game.current.scene.sprite[i].move.x = -1;
				if(Game.current.scene.sprite[i].speed.t.y !== 0)
					Game.current.scene.sprite[i].speed.t.y > 0 ? Game.current.scene.sprite[i].move.y = 1 : Game.current.scene.sprite[i].move.y = -1;
			}
		}
		return r;
	};
	
	this.updateSpriteCollision = function() {
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			for(var j = 0; j < Game.current.scene.sprite.length; j++) {
				if(i !== j) {
					var tjx = Game.current.scene.sprite[j].move.x;
					var tjy = Game.current.scene.sprite[j].move.y;
					if(j > i) {
						Game.current.scene.sprite[j].move.x = 0;
						Game.current.scene.sprite[j].move.y = 0;
					}
					if((Game.current.scene.sprite[i].collides.sprite && Game.current.scene.sprite[j].collidable) && (Game.current.scene.sprite[i].collidesWithSprite(Game.current.scene.sprite[j]))) {
						var mc = 0;
						while(mc <= 2) {
							if(Game.current.scene.sprite[i].move.x !== 0 || Game.current.scene.sprite[i].move.y !== 0) {
								if(mc === 0 || mc === 2) {
									var tx = Game.current.scene.sprite[i].move.x;
									Game.current.scene.sprite[i].move.x = 0;
									if(Game.current.scene.sprite[i].collidesWithSprite(Game.current.scene.sprite[j])) {
										if(Game.current.scene.sprite[i].move.y > 0) {
											Game.current.scene.sprite[i].collision.sprite.down = true;
										}
										if(Game.current.scene.sprite[i].move.y < 0) {
											Game.current.scene.sprite[i].collision.sprite.up = true;
										}
										Game.current.scene.sprite[i].collision.sprite.id = j;
										Game.current.scene.sprite[i].move.y = 0;
										Game.current.scene.sprite[i].speed.y = 0;
										Game.current.scene.sprite[i].speed.t.y = 0;
									}
									Game.current.scene.sprite[i].move.x = tx;
								}
								if(mc === 1 || mc === 2) {
									var ty = Game.current.scene.sprite[i].move.y;
									if(mc !== 2)
										Game.current.scene.sprite[i].move.y = 0;
									if(Game.current.scene.sprite[i].collidesWithSprite(Game.current.scene.sprite[j])) {
										if(Game.current.scene.sprite[i].move.x > 0) {
											Game.current.scene.sprite[i].collision.sprite.right = true;
										}
										if(Game.current.scene.sprite[i].move.x < 0) {
											Game.current.scene.sprite[i].collision.sprite.left = true;
										}
										Game.current.scene.sprite[i].collision.sprite.id = j;
										Game.current.scene.sprite[i].move.x = 0;
										Game.current.scene.sprite[i].speed.x = 0;
										Game.current.scene.sprite[i].speed.t.x = 0;
									}
									Game.current.scene.sprite[i].move.y = ty;
								}
							}
							mc++;
						}
					}
					Game.current.scene.sprite[j].move.x = tjx;
					Game.current.scene.sprite[j].move.y = tjy;
				}
			}
		}
	};
	
	this.updateMapCollision = function() {
		if(Game.current.scene.map !== null) {
			for(var i = 0; i < Game.current.scene.sprite.length; i++) {
				for(var j = 0; j < Game.current.scene.map.layer.length; j++) {
					if(Game.current.scene.map.layer[j].collidable && Game.current.scene.sprite[i].collides.map) {
						var mc = 0;
						while(mc <= 2) {
							if(Game.current.scene.sprite[i].move.x !== 0 || Game.current.scene.sprite[i].move.y !== 0) {
								for(var k = 0; k <= Math.ceil((Game.current.scene.sprite[i].frame.height - Game.current.scene.sprite[i].frame.offset.height) / Game.current.scene.map.tile.height); k++) {
									for(var l = 0; l <= Math.ceil((Game.current.scene.sprite[i].frame.width - Game.current.scene.sprite[i].frame.offset.width) / Game.current.scene.map.tile.width); l++) {
										var tile = Game.current.scene.map.getTile(Game.current.scene.map.layer[j], Game.current.scene.sprite[i].position.x + Game.current.scene.sprite[i].position.offset.x + Game.current.scene.sprite[i].move.x + Math.abs(Game.current.scene.map.layer[j].position.x) + (l * Game.current.scene.map.tile.width), Game.current.scene.sprite[i].position.y + Game.current.scene.sprite[i].position.offset.y + Game.current.scene.sprite[i].move.y + Math.abs(Game.current.scene.map.layer[j].position.y) + (k * Game.current.scene.map.tile.height), Game.current.scene.sprite[i].frame.width, Game.current.scene.sprite[i].frame.height);
										if(tile === null) {
											Game.current.scene.sprite[i].kill = true;
										}
										if(tile !== null && Game.current.scene.sprite[i].collidesWithTile(Game.current.scene.map.layer[j], Game.current.scene.map.layer[j].data[tile])) {
											if(mc === 0 || mc === 2) {
												var tx = Game.current.scene.sprite[i].move.x;
												Game.current.scene.sprite[i].move.x = 0;
												if(Game.current.scene.sprite[i].collidesWithTile(Game.current.scene.map.layer[j], Game.current.scene.map.layer[j].data[tile])) {
													if(Game.current.scene.sprite[i].move.y > 0) {
														Game.current.scene.sprite[i].collision.map.down = true;
													}
													if(Game.current.scene.sprite[i].move.y < 0) {
														Game.current.scene.sprite[i].collision.map.up = true;
													}
													if((Game.current.scene.sprite[i].checkCollision.map.up && Game.current.scene.sprite[i].collision.map.up) || (Game.current.scene.sprite[i].checkCollision.map.down && Game.current.scene.sprite[i].collision.map.down)) {
														Game.current.scene.sprite[i].move.y = 0;
														Game.current.scene.sprite[i].speed.y = 0;
														Game.current.scene.sprite[i].speed.t.y = 0;
													}
												}
												Game.current.scene.sprite[i].move.x = tx;
											}
											if(mc === 1 || mc === 2) {
												var ty = Game.current.scene.sprite[i].move.y;
												if(mc !== 2)
												Game.current.scene.sprite[i].move.y = 0;
												if(Game.current.scene.sprite[i].collidesWithTile(Game.current.scene.map.layer[j], Game.current.scene.map.layer[j].data[tile])) {
													if(Game.current.scene.sprite[i].move.x > 0) {
														Game.current.scene.sprite[i].collision.map.right = true;
													}
													if(Game.current.scene.sprite[i].move.x < 0) {
														Game.current.scene.sprite[i].collision.map.left = true;
													}
													if((!Game.current.scene.sprite[i].checkCollision.map.up && Game.current.scene.sprite[i].collision.map.up) || (!Game.current.scene.sprite[i].checkCollision.map.down && Game.current.scene.sprite[i].collision.map.down)) {
													} else {	
														if((Game.current.scene.sprite[i].checkCollision.map.left && Game.current.scene.sprite[i].collision.map.left) || (Game.current.scene.sprite[i].checkCollision.map.right && Game.current.scene.sprite[i].collision.map.right)) {
															Game.current.scene.sprite[i].move.x = 0;
															Game.current.scene.sprite[i].speed.x = 0;
															Game.current.scene.sprite[i].speed.t.x = 0;
														}
													}
												}
												Game.current.scene.sprite[i].move.y = ty;
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
	
	this.updateSpriteCollisionCheck = function() {
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			if(Game.current.scene.sprite[i].speed.check.x && Game.current.scene.sprite[i].speed.check.y) {
				Game.current.scene.sprite[i].resetMove();
			}
		}
	};
	
	this.update = function(_exit) {
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			Game.current.scene.sprite[i].update();
			Game.current.scene.sprite[i].flipUpdate();
			if(Game.current.scene.sprite[i].animation !== null && _exit)
				Game.current.scene.sprite[i].animation.nextFrame();
		}
		if(Game.current.scene.map !== null)
			Game.current.scene.map.update(Game.canvas);
	};
	
	this.checkBoundaries = function() {
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			if(Game.current.scene.boundaries.x !== null) {
				if(Game.current.scene.sprite[i].position.x < Game.current.scene.boundaries.x) {
					Game.current.scene.sprite[i].position.x = Game.current.scene.boundaries.x;
				}
				if(Game.current.scene.sprite[i].position.x > Game.current.scene.boundaries.x + Game.current.scene.boundaries.width) {
					Game.current.scene.sprite[i].position.x = Game.current.scene.boundaries.x + Game.current.scene.boundaries.width;
				}
			}
			if(Game.current.scene.boundaries.y !== null) {
				if(Game.current.scene.sprite[i].position.y < Game.current.scene.boundaries.y) {
					Game.current.scene.sprite[i].position.y = Game.current.scene.boundaries.y;
				}
				if(Game.current.scene.sprite[i].position.y > Game.current.scene.boundaries.y + Game.current.scene.boundaries.height) {
					Game.current.scene.sprite[i].position.y = Game.current.scene.boundaries.y + Game.current.scene.boundaries.height;
				}
			}
		}
	};
	
	this.reset = function() {
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			Game.current.scene.sprite[i].resetMove();
		}
		if(Game.current.scene.map !== null)
			Game.current.scene.map.resetScroll();
	};
	
	this.draw = function() {
		Game.contextMap.clearRect(0, 0, Game.canvasMap.width, Game.canvasMap.height);
		Game.contextSprite.clearRect(0, 0, Game.canvasSprite.width, Game.canvasSprite.height);	
		Game.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);	
		if(Game.current.scene.map !== null && Game.current.scene.map.visible) {
			Game.current.scene.map.draw();
		}
		for(var i = 0; i < Game.current.scene.sprite.length; i++) {
			if(Game.current.scene.sprite[i].visible) {
				Game.current.scene.sprite[i].draw();
			}
		}
		Game.contextMap.drawImage(Game.canvasSprite, 0, 0);
		Game.context.drawImage(Game.canvasMap, 0, 0);
		requestAnimFrame(function(){Game.draw()});
	};
	
	this.removeSprite = function() {
		for(var i = Game.current.scene.sprite.length - 1; i >= 0; i--) {
			if(Game.current.scene.sprite[i].kill) {
				Game.current.scene.sprite.splice(i, 1);
			}
		}
	};
	
	this.play = function() {
		Game.status = 1;
	};
	
	this.stop = function() {
		Game.status = 0;
	};
};

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){window.setTimeout(callback, 1000 / 60)};
})();

window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
})();