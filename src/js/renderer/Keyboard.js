function Keyboard(parameters) {

	this.el = document.querySelectorAll('main')[0];
	this.canvas = document.getElementsByTagName('canvas')[0];

	paper.setup(this.canvas);
	this.attachEvents();

	this.keyboard = undefined;
	this.keyMap = undefined;
	this.path = new paper.Path();
	this.graphics = undefined;

	this.text = [];

	this.debug = {
		center: undefined,
		boundingBox: undefined
	}

	paper.project.importSVG('../keyboard.svg', { onLoad: this.initKeyboard.bind(this), onError: this.onErr.bind(this) });
	// paper.view.zoom = 0.5;

}

Keyboard.prototype.onErr = function(err) {
	console.log(err);
}

Keyboard.prototype.attachEvents = function() {

	window.addEventListener('keydown', function(e) {

		// console.log(e.key);
		// console.log('Loc', e.location);
		// var char = String.fromCharCode(e.keyCode);
		// console.log(char, e.key);
		
		this.onKeyDown(e.key.toLowerCase(), e.location);
		e.preventDefault();

	}.bind(this));

	window.addEventListener('keyup', function(e) {
		this.onKeyUp(e.key.toLowerCase(), e.location);
		e.preventDefault();
	}.bind(this));

	window.addEventListener('resize', function(e) {
		this.resize();
	}.bind(this));

}

Keyboard.prototype.resize = function() {

	// View resize
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.canvas.style = '';
	paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);

	// Debug
	this.debug.center.position = paper.view.center;
	this.debug.boundingBox.position = paper.view.center;

	// Responsive
	this.graphics.position = paper.view.center;

	paper.view.draw();

}

Keyboard.prototype.initKeyboard = function(keyboard, svg) {

	console.log('Imported!');

	// Debug
	this.debug.center = new paper.Shape.Circle(new paper.Point(80, 50), 2);
	this.debug.center.fillColor = "red";

	// Keyboard
	this.keyboard = keyboard.children[0];
	// this.keyboard.applyMatrix = false;

	this.keyboard.style = {
		fillColor: "#808080",
		strokeColor: new paper.Color(1,1,1,0.4),
		strokeWidth: 1.5,
		shadowColor: new paper.Color(0,0,0,0.45),
		shadowBlur: 4,
		shadowOffset: new paper.Point(0, 2)
	}

	// Debug
	this.debug.boundingBox = new paper.Path.Rectangle(this.keyboard.bounds);
	// this.debug.boundingBox.strokeColor = "blue";

	for (var i = this.keyboard.children.length - 1; i >= 0; i--) {
		
		// Style keys individually

		this.keyboard.children[i].strokeColor = new paper.Color(Math.random(), Math.random(), Math.random());
		this.keyboard.children[i].strokeColor = {
			gradient: {
				stops: [new paper.Color(1,1,1,0.3), new paper.Color(1,1,1,0.2)]
			},
			origin: this.keyboard.children[i].bounds.topCenter,
			destination: this.keyboard.children[i].bounds.bottomCenter
		}

	}

	this.keyMap = [
		"1",
		"`",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0",
		"-",
		"=",
		"q",
		"w",
		"e",
		"r",
		"t",
		"y",
		"u",
		"i",
		"o",
		"p",
		"[",
		"]",
		"\\",
		"a",
		"s",
		"d",
		"f",
		"g",
		"h",
		"j",
		"k",
		"l",
		";",
		"'",
		"z",
		"x",
		"c",
		"v",
		"b",
		"n",
		"m",
		",",
		".",
		"/",
		"backspace",
		"tab",
		"capslock",
		"shift", // L
		" ", // Space
		"//meta", // R
		"control", // L
		"//alt", // R
		"alt", // L
		"//control", // R
		"meta", // L
		"//shift", // R
		"enter",
	]

	this.initPath();

	this.resize();

}

Keyboard.prototype.initPath = function() {

	this.path.style = {
		strokeWidth : 6,
		fillColor: new paper.Color(0,0,0,0),
		strokeCap : 'round',
		strokeJoin : 'round'
	}

	this.path.strokeColor = {
		gradient: {
			stops: [new paper.Color('#00FFF4'), new paper.Color('#1F00FF')]
		},
		origin: this.debug.boundingBox.bounds.leftCenter,
		destination: this.debug.boundingBox.bounds.rightCenter
	}

	this.graphics = new paper.Group([this.keyboard, this.path]);
	this.graphics.bringToFront();

}

Keyboard.prototype.locateKey = function(key, location) {

	var index = null

	if(location == 1 || location == 0) {

		// Left side
		
		for (var i = this.keyMap.length - 1; i >= 0; i--) {
			if(this.keyMap[i] == key) index = i;
		}

		if(index == null) {
			console.log('No match');
		}

	}
	else if(location == 2) {

		// Right side

		if(key == "meta") {
			index = 52;
		}

		if(key == "alt") {
			index = 54;
		}

		if(key == "control") {
			index = 56;
		}

		if(key == "shift") {
			index = 58;
		}

	}

	return index;

}

Keyboard.prototype.onKeyDown = function(key, location) {

	var index = this.locateKey(key, location);

	this.keyboard.children[index].shadowColor = new paper.Color(0,0,0,0.2);
	this.keyboard.children[index].shadowBlur = 1;
	this.keyboard.children[index].shadowOffset = new paper.Point(0, 1);

	if(key == "backspace") {
		this.delete();
		return;
	}

	if(key == "enter") {
		if(this.path.segments.length > 1) {
			this.sendToPrinter();
			this.resetAll();
		}
		return;
	}

	this.addToText(key);
	this.addToPath(index);

}

Keyboard.prototype.onKeyUp = function(key, location) {

	var index = this.locateKey(key, location);

	this.keyboard.children[index].shadowColor = new paper.Color(0,0,0,0.45);
	this.keyboard.children[index].shadowBlur = 4;
	this.keyboard.children[index].shadowOffset = new paper.Point(0, 2);

	paper.view.draw();

}

Keyboard.prototype.addToPath = function(index) {

	this.path.add(this.keyboard.children[index].bounds.center);
	this.path.smooth();

	paper.view.draw();

}

Keyboard.prototype.addToText = function(character) {

	this.text.push(character);

}

Keyboard.prototype.delete = function() {

	this.path.removeSegment(this.path.segments.length-1);
	this.text.pop();

	paper.view.draw();

}

Keyboard.prototype.sendToPrinter = function() {

	var flash = document.getElementsByClassName('dragOverlay')[0];
	removeClass(flash, 'flash');
	void flash.offsetWidth;
	addClass(flash, 'flash');

	var pathBox = new paper.Path.Rectangle(paper.view.bounds);
	var pathCopy = this.path.clone();
	
	pathBox.fillColor = "white";
	pathBox.sendToBack();
	
	pathCopy.bringToFront();
	pathCopy.strokeColor = "black";
	pathCopy.strokeWidth = 25;

	this.keyboard.opacity = 0;
	document.getElementsByTagName('body')[0].style.backgroundColor = "#FFFFFF";

	paper.view.draw();

	// Format text for printing
	for (var i = this.text.length - 1; i >= 0; i--) {
		if(this.text[i] == 'meta' || this.text[i] == 'control' || this.text[i] == 'alt' || this.text[i] == 'shift' || this.text[i] == 'tab' || this.text[i] == 'capslock') {
			this.text[i] = '░';
		}
	}

	var exports = new paper.Group([pathBox, pathCopy]);

	// Format svg for saving
	var svg = exports.exportSVG({ asString: true });
	var svg = '<?xml version="1.0" encoding="utf-8"?>';
	svg += '<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="2136px" height="718px" viewBox="-482 180 2136 718" enable-background="new -482 180 2136 718" xml:space="preserve">';
	svg += exports.exportSVG({ asString: true });
	svg += '</svg>';

	ipcRenderer.send('print', this.text.join(''), this.canvas.toDataURL("image/jpeg"), svg);

	pathBox.remove();
	pathCopy.remove();
	document.getElementsByTagName('body')[0].style.backgroundColor = "#808080";
	this.keyboard.opacity = 1;


}

Keyboard.prototype.resetAll = function() {

	this.path.removeSegments();
	this.text = [];

}