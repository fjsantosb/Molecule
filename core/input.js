var Input = new function() {
	this.key = {SPACE: 0, LEFT_ARROW: 0, UP_ARROW: 0, RIGHT_ARROW: 0, DOWN_ARROW: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0, N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0};
	this.mouse = {x: 0, y: 0, BUTTON_LEFT: 0, BUTTON_MIDDLE: 0, BUTTON_RIGHT: 0};
	this.touch = new Array();
	
	// Method to init 'keyboard', 'mouse' or 'touch' depending of type
	this.enable = function(_type) {
		if(_type === 'keyboard') {
			document.addEventListener('keydown', this.onkeydown, true);
			document.addEventListener('keyup', this.onkeyup, true);
		}
		if(_type === 'mouse') {
			document.addEventListener('mousedown', this.onmousedown, true);
			document.addEventListener('mousemove', this.onmousemove, true);
			document.addEventListener('mouseup', this.onmouseup, true);
		}
		if(_type === 'touch') {
			Game.canvas.addEventListener('touchstart', this.ontouchstart, true);
			Game.canvas.addEventListener('touchmove', this.ontouchmove, true);
			Game.canvas.addEventListener('touchend', this.ontouchend, true);
			Game.canvas.addEventListener('touchcancel', this.ontouchcancel, true);
		}
	};
	
	// Method to remove 'keyboard', 'mouse' or 'touch' depending of type
	this.disable = function(_type) {
		if(_type === 'keyboard') {
			document.removeEventListener('keydown', this.onkeydown, true);
			document.removeEventListener('keyup', this.onkeyup, true);
		}
		if(_type === 'mouse') {
			document.removeEventListener('mousedown', this.onmousedown, true);
			document.removeEventListener('mousemove', this.onmousemove, true);
			document.removeEventListener('mouseup', this.onmouseup, true);
		}
		if(_type === 'touch') {
			Game.canvas.removeEventListener('touchstart', this.ontouchstart, true);
			Game.canvas.removeEventListener('touchmove', this.ontouchmove, true);
			Game.canvas.removeEventListener('touchend', this.ontouchend, true);
			Game.canvas.removeEventListener('touchcancel', this.ontouchcancel, true);
		}
	};
	
	// Method 'onkeydown' for 'keyboard' type
	this.onkeydown = function(_e) {
		switch(_e.keyCode) {
			case 32:
				Input.key.SPACE = 1;
				break;
			case 37:
				Input.key.LEFT_ARROW = 1;
				break;
			case 38:
				Input.key.UP_ARROW = 1;
				break;
			case 39:
				Input.key.RIGHT_ARROW = 1;
				break;
			case 40:
				Input.key.DOWN_ARROW = 1;
				break;
			case 65:
				Input.key.A = 1;
				break;
			case 66:
				Input.key.B = 1;
				break;
			case 67:
				Input.key.C = 1;
				break;
			case 68:
				Input.key.D = 1;
				break;
			case 69:
				Input.key.E = 1;
				break;
			case 70:
				Input.key.F = 1;
				break;
			case 71:
				Input.key.G = 1;
				break;
			case 72:
				Input.key.H = 1;
				break;
			case 73:
				Input.key.I = 1;
				break;
			case 74:
				Input.key.J = 1;
				break;
			case 75:
				Input.key.K = 1;
				break;
			case 76:
				Input.key.L = 1;
				break;
			case 77:
				Input.key.M = 1;
				break;
			case 78:
				Input.key.N = 1;
				break;
			case 79:
				Input.key.O = 1;
				break;
			case 80:
				Input.key.P = 1;
				break;
			case 81:
				Input.key.Q = 1;
				break;
			case 82:
				Input.key.R = 1;
				break;
			case 83:
				Input.key.S = 1;
				break;
			case 84:
				Input.key.T = 1;
				break;
			case 85:
				Input.key.U = 1;
				break;
			case 86:
				Input.key.V = 1;
				break;
			case 87:
				Input.key.W = 1;
				break;
			case 88:
				Input.key.X = 1;
				break;
			case 89:
				Input.key.Y = 1;
				break;
			case 90:
				Input.key.Z = 1;
				break;
		}
	};
	
	// Method 'onkeyup' for 'keyboard' type
	this.onkeyup = function(_e) {
		switch(_e.keyCode) {
			case 32:
				Input.key.SPACE = 0;
				break;
			case 37:
				Input.key.LEFT_ARROW = 0;
				break;
			case 38:
				Input.key.UP_ARROW = 0;
				break;
			case 39:
				Input.key.RIGHT_ARROW = 0;
				break;
			case 40:
				Input.key.DOWN_ARROW = 0;
				break;
			case 65:
				Input.key.A = 0;
				break;
			case 66:
				Input.key.B = 0;
				break;
			case 67:
				Input.key.C = 0;
				break;
			case 68:
				Input.key.D = 0;
				break;
			case 69:
				Input.key.E = 0;
				break;
			case 70:
				Input.key.F = 0;
				break;
			case 71:
				Input.key.G = 0;
				break;
			case 72:
				Input.key.H = 0;
				break;
			case 73:
				Input.key.I = 0;
				break;
			case 74:
				Input.key.J = 0;
				break;
			case 75:
				Input.key.K = 0;
				break;
			case 76:
				Input.key.L = 0;
				break;
			case 77:
				Input.key.M = 0;
				break;
			case 78:
				Input.key.N = 0;
				break;
			case 79:
				Input.key.O = 0;
				break;
			case 80:
				Input.key.P = 0;
				break;
			case 81:
				Input.key.Q = 0;
				break;
			case 82:
				Input.key.R = 0;
				break;
			case 83:
				Input.key.S = 0;
				break;
			case 84:
				Input.key.T = 0;
				break;
			case 85:
				Input.key.U = 0;
				break;
			case 86:
				Input.key.V = 0;
				break;
			case 87:
				Input.key.W = 0;
				break;
			case 88:
				Input.key.X = 0;
				break;
			case 89:
				Input.key.Y = 0;
				break;
			case 90:
				Input.key.Z = 0;
				break;
		}
	};
	
	// Method 'onmousedown' for 'mouse' type
	this.onmousedown = function(_e) {
		switch(_e.button) {
			case 0:
				Input.mouse.BUTTON_LEFT = 1;
				break;
			case 1:
				Input.mouse.BUTTON_MIDDLE = 1;
				break;
			case 2:
				Input.mouse.BUTTON_RIGHT = 1;
				break;
		}
	};
	
	// Method 'onmousemove' for 'mouse' type
	this.onmousemove = function(_e) {
		Input.mouse.x = (_e.pageX  - Game.canvas.offsetLeft) / Game.scale;
		Input.mouse.y = (_e.pageY - Game.canvas.offsetTop) / Game.scale;
	};
	
	// Method 'onmouseup' for 'mouse' type
	this.onmouseup = function(_e) {
		switch(_e.button) {
			case 0:
				Input.mouse.BUTTON_LEFT = 0;
				break;
			case 1:
				Input.mouse.BUTTON_MIDDLE = 0;
				break;
			case 2:
				Input.mouse.BUTTON_RIGHT = 0;
				break;
		}
	};
	
	// Method 'ontouchstart' for 'touch' type
	this.ontouchstart = function(_e) {
		_e.preventDefault();
		Input.normalizeTouches(_e.touches);
	};
	
	// Method 'ontouchmove' for 'touch' type
	this.ontouchmove = function(_e) {
		_e.preventDefault();
		Input.normalizeTouches(_e.touches);
	};
	
	// Method 'ontouchend' for 'touch' type
	this.ontouchend = function(_e) {
		_e.preventDefault();
		Input.normalizeTouches(_e.touches);
	};
	
	// Method 'ontouchcancel' for 'touch' type
	this.ontouchcancel = function(_e) {
		_e.preventDefault();
		Input.normalizeTouches(_e.touches);
	};
	
	// Method to normalize touches depending of canvas size and position
	this.normalizeTouches = function(_touches) {
		Input.touch = [];
		for(var i = 0; i < _touches.length; i++) {
			Input.touch.push({x: (_touches[i].pageX - Game.canvas.offsetLeft) / Game.scale, y: (_touches[i].pageY - Game.canvas.offsetTop) / Game.scale});
		}
	};
};