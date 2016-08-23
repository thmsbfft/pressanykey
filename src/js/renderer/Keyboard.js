function Keyboard(parameters) {

	this.el = document.querySelectorAll('main')[0];
	this.canvas = document.getElementsByTagName('canvas')[0];

	paper.setup(this.canvas);
	this.attachEvents();

	this.keyboard = undefined;

	this.debug = {
		center: undefined
	}

	// this.resize();
	this.initCanvas();
}

Keyboard.prototype.attachEvents = function() {

	window.addEventListener('keypress', function(e) {

		console.log(e.keyCode);

		var char = String.fromCharCode(e.keyCode);
		
		this.addToPath(e.key);
		console.log(char, e.key);
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
	paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);

	// Debug
	this.debug.center.position = paper.view.center;

	// Responsive
	this.keyboard.setPosition(paper.view.viewSize.width/2, paper.view.viewSize.height/2);

	paper.view.draw();

}

Keyboard.prototype.initCanvas = function() {

	// Debug
	this.debug.center = new paper.Shape.Circle(new paper.Point(80, 50), 2);
	this.debug.center.fillColor = "red";

	// Keyboard Init
	this.keyboard = paper.project.importSVG(document.getElementById('keyboard_svg')).children[0];
	this.keyboard.strokeColor = "#8e8e8e";
	this.keyboard.strokeWidth = 1;

	this.resize();

}

Keyboard.prototype.addToPath = function(key) {

	// console.log(this.keyboard.children);
	this.keyboard.children[0].strokeColor = "red";

}