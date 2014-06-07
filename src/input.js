Molecule.module('Molecule.Input', function (require, p) {

    function Input(_game) {
        var self = this;

        this.game = _game;
        this.key = {SPACE: 0, LEFT_ARROW: 0, UP_ARROW: 0, RIGHT_ARROW: 0, DOWN_ARROW: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0, N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0};
        this.mouse = {x: 0, y: 0, BUTTON_LEFT: 0, BUTTON_MIDDLE: 0, BUTTON_RIGHT: 0};
        this.touch = [];
        this.gamepad = [];
        
        this.gamepadEnabled = false;
        
        this.accelerometer = {x: 0, y: 0, z: 0, alpha: 0, beta: 0, gamma: 0, interval: 0};
        
        this.keydown = function(_e){self.onkeydown(_e)};
        this.keyup = function(_e){self.onkeyup(_e)};
        
        this.mousedown = function(_e){self.onmousedown(_e)};
        this.mousemove = function(_e){self.onmousemove(_e)};
        this.mouseup = function(_e){self.onmouseup(_e)};
        
        this.touchstart = function(_e){self.ontouchstart(_e)};
        this.touchmove = function(_e){self.ontouchmove(_e)};
        this.touchend = function(_e){self.ontouchend(_e)};
        this.touchcancel = function(_e){self.ontouchcancel(_e)};
        
        this.devicemotion = function(_e){self.ondevicemotion(_e)};
    }

    // Method to init 'keyboard', 'mouse' or 'touch' depending of type
    Input.prototype.enable = function(_type) {

        if(_type === 'keyboard') {
            document.addEventListener('keydown', this.keydown, true);
            document.addEventListener('keyup', this.keyup, true);
        }
        if(_type === 'mouse') {
            this.game.canvas.addEventListener('mousedown', this.mousedown, true);
            this.game.canvas.addEventListener('mousemove', this.mousemove, true);
            this.game.canvas.addEventListener('mouseup', this.mouseup, true);
        }
        if(_type === 'touch') {
            this.game.canvas.addEventListener('MSPointerDown', this.touchstart, true);
            this.game.canvas.addEventListener('MSPointerMove', this.touchmove, true);
            this.game.canvas.addEventListener('MSPointerUp', this.touchend, true);
            this.game.canvas.addEventListener('MSPointerCancel', this.touchcancel, true);
            
            this.game.canvas.addEventListener('touchstart', this.touchstart, true);
            this.game.canvas.addEventListener('touchmove', this.touchmove, true);
            this.game.canvas.addEventListener('touchend', this.touchend, true);
            this.game.canvas.addEventListener('touchcancel', this.touchcancel, true);
        }
        if(_type === 'gamepad') {
            this.gamepadEnabled = true;
        }
        if(_type === 'accelerometer') {
            window.addEventListener('devicemotion', this.devicemotion, true);
        }
    };

    // Method to remove 'keyboard', 'mouse' or 'touch' depending of type
    Input.prototype.disable = function(_type) {

        if(_type === 'keyboard') {
            document.removeEventListener('keydown', this.keydown, true);
            document.removeEventListener('keyup', this.keyup, true);
        }
        if(_type === 'mouse') {
            this.game.canvas.removeEventListener('mousedown', this.mousedown, true);
            this.game.canvas.removeEventListener('mousemove', this.mousemove, true);
            this.game.canvas.removeEventListener('mouseup', this.mouseup, true);
        }
        if(_type === 'touch') {
            this.game.canvas.removeEventListener('MSPointerDown', this.touchstart, true);
            this.game.canvas.removeEventListener('MSPointerMove', this.touchmove, true);
            this.game.canvas.removeEventListener('MSPointerUp', this.touchend, true);
            this.game.canvas.removeEventListener('MSPointerCancel', this.touchcancel, true);
            
            this.game.canvas.removeEventListener('touchstart', this.touchstart, true);
            this.game.canvas.removeEventListener('touchmove', this.touchmove, true);
            this.game.canvas.removeEventListener('touchend', this.touchend, true);
            this.game.canvas.removeEventListener('touchcancel', this.touchcancel, true);
        }
        if(_type === 'gamepad') {
            this.gamepadEnabled = false;
        }
        if(_type === 'accelerometer') {
            window.removeEventListener('devicemotion', this.devicemotion, true);
        }
    };

    Input.prototype.checkGamepad = function() {
        var i;
        var getGamepads;
        this.gamepad = [];
        if(this.gamepadEnabled) {
            if(navigator.getGamepads || navigator.webkitGetGamepads) {
                if(navigator.getGamepads) {
                    for(i = 0; i < navigator.getGamepads().length; i++) {
                        if(navigator.getGamepads()[i] !== undefined && navigator.getGamepads()[i].timestamp !== 0) {
                            this.gamepad.push(navigator.getGamepads()[i]);
                        }
                    }
                } else if(navigator.webkitGetGamepads) {
                    for(i = 0; i < navigator.webkitGetGamepads().length; i++) {
                        if(navigator.webkitGetGamepads()[i] !== undefined && navigator.webkitGetGamepads()[i].timestamp !== 0) {
                            this.gamepad.push(navigator.webkitGetGamepads()[i]);
                        }
                    }
                }
            }
        }
        if(this.gamepad.length === 0) {
            this.gamepad.push({axes: 0, buttons: 0});
        }
    };

    // Method 'onkeydown' for 'keyboard' type
    Input.prototype.onkeydown = function(_e) {
        _e.preventDefault();
        switch(_e.keyCode) {
            case 32:
                this.key.SPACE = 1;
            break;
            case 37:
                this.key.LEFT_ARROW = 1;
            break;
            case 38:
                this.key.UP_ARROW = 1;
            break;
            case 39:
                this.key.RIGHT_ARROW = 1;
            break;
            case 40:
                this.key.DOWN_ARROW = 1;
            break;
            case 65:
                this.key.A = 1;
            break;
            case 66:
                this.key.B = 1;
            break;
            case 67:
                this.key.C = 1;
            break;
            case 68:
                this.key.D = 1;
            break;
            case 69:
                this.key.E = 1;
            break;
            case 70:
                this.key.F = 1;
            break;
            case 71:
                this.key.G = 1;
            break;
            case 72:
                this.key.H = 1;
            break;
            case 73:
                this.key.I = 1;
            break;
            case 74:
                this.key.J = 1;
            break;
            case 75:
                this.key.K = 1;
            break;
            case 76:
                this.key.L = 1;
            break;
            case 77:
                this.key.M = 1;
            break;
            case 78:
                this.key.N = 1;
            break;
            case 79:
                this.key.O = 1;
            break;
            case 80:
                this.key.P = 1;
            break;
            case 81:
                this.key.Q = 1;
            break;
            case 82:
                this.key.R = 1;
            break;
            case 83:
                this.key.S = 1;
            break;
            case 84:
                this.key.T = 1;
            break;
            case 85:
                this.key.U = 1;
            break;
            case 86:
                this.key.V = 1;
            break;
            case 87:
                this.key.W = 1;
            break;
            case 88:
                this.key.X = 1;
            break;
            case 89:
                this.key.Y = 1;
            break;
            case 90:
                this.key.Z = 1;
            break;
        }
    };

    // Method 'onkeyup' for 'keyboard' type
    Input.prototype.onkeyup = function(_e) {
        _e.preventDefault();
            switch(_e.keyCode) {
            case 32:
                this.key.SPACE = 0;
            break;
            case 37:
                this.key.LEFT_ARROW = 0;
            break;
            case 38:
                this.key.UP_ARROW = 0;
            break;
            case 39:
                this.key.RIGHT_ARROW = 0;
            break;
            case 40:
                this.key.DOWN_ARROW = 0;
            break;
            case 65:
                this.key.A = 0;
            break;
            case 66:
                this.key.B = 0;
            break;
            case 67:
                this.key.C = 0;
            break;
            case 68:
                this.key.D = 0;
            break;
            case 69:
                this.key.E = 0;
            break;
            case 70:
                this.key.F = 0;
            break;
            case 71:
                this.key.G = 0;
            break;
            case 72:
                this.key.H = 0;
            break;
            case 73:
                this.key.I = 0;
            break;
            case 74:
                this.key.J = 0;
            break;
            case 75:
                this.key.K = 0;
            break;
            case 76:
                this.key.L = 0;
            break;
            case 77:
                this.key.M = 0;
            break;
            case 78:
                this.key.N = 0;
            break;
            case 79:
                this.key.O = 0;
            break;
            case 80:
                this.key.P = 0;
            break;
            case 81:
                this.key.Q = 0;
            break;
            case 82:
                this.key.R = 0;
            break;
            case 83:
                this.key.S = 0;
            break;
            case 84:
                this.key.T = 0;
            break;
            case 85:
                this.key.U = 0;
            break;
            case 86:
                this.key.V = 0;
            break;
            case 87:
                this.key.W = 0;
            break;
            case 88:
                this.key.X = 0;
            break;
            case 89:
                this.key.Y = 0;
            break;
            case 90:
                this.key.Z = 0;
            break;
        }
    };

    // Method 'onmousedown' for 'mouse' type
    Input.prototype.onmousedown = function(_e) {
        switch(_e.button) {
            case 0:
                this.mouse.BUTTON_LEFT = 1;
            break;
            case 1:
                this.mouse.BUTTON_MIDDLE = 1;
            break;
            case 2:
                this.mouse.BUTTON_RIGHT = 1;
            break;
        }
        this.mousePosition(_e);
    };

    // Method 'onmousemove' for 'mouse' type
    Input.prototype.onmousemove = function(_e) {
        this.mousePosition(_e);
    };

    // Method 'onmouseup' for 'mouse' type
    Input.prototype.onmouseup = function(_e) {
        switch(_e.button) {
            case 0:
                this.mouse.BUTTON_LEFT = 0;
            break;
            case 1:
                this.mouse.BUTTON_MIDDLE = 0;
            break;
            case 2:
                this.mouse.BUTTON_RIGHT = 0;
            break;
        }
        this.mousePosition(_e);
    };

    Input.prototype.mousePosition = function(_e) {
        this.mouse.x = (_e.pageX  - this.game.canvas.offsetLeft) / this.game.scale;
        this.mouse.y = (_e.pageY - this.game.canvas.offsetTop) / this.game.scale;
    };

    // Method 'ontouchstart' for 'touch' type
    Input.prototype.ontouchstart = function(_e) {
        _e.preventDefault();
        this.normalizeTouches(_e);
    };

    // Method 'ontouchmove' for 'touch' type
    Input.prototype.ontouchmove = function(_e) {
        _e.preventDefault();
        this.normalizeTouches(_e);
    };

    // Method 'ontouchend' for 'touch' type
    Input.prototype.ontouchend = function(_e) {
        _e.preventDefault();
        this.normalizeTouches(_e);
    };

    // Method 'ontouchcancel' for 'touch' type
    Input.prototype.ontouchcancel = function(_e) {
        _e.preventDefault();
        this.touch = [];
    };

    // Method to normalize touches depending of canvas size and position
    Input.prototype.normalizeTouches = function(_e) {
        this.touch = [];
        if(_e.touches) {
            for(var i = 0; i < _e.touches.length; i++) {
                this.touch.push({x: (_e.touches[i].pageX - this.game.canvas.offsetLeft) / this.game.scale, y: (_e.touches[i].pageY - this.game.canvas.offsetTop) / this.game.scale});
            }
        } else {
            if(_e !== undefined) {
                this.touch.push({x: (_e.pageX - this.game.canvas.offsetLeft) / this.game.scale, y: (_e.pageY - this.game.canvas.offsetTop) / this.game.scale});
            }
        }
    };
    
    Input.prototype.ondevicemotion = function(_e) {
        this.accelerometer.x = _e.acceleration.x;
        this.accelerometer.y = _e.acceleration.y;
        this.accelerometer.z = _e.acceleration.z;
        
        this.accelerometer.alpha = _e.rotationRate.alpha;
        this.accelerometer.beta = _e.rotationRate.beta;
        this.accelerometer.gamma = _e.rotationRate.gamma;
        
        this.accelerometer.interval = _e.interval;
    }

    return Input;

});