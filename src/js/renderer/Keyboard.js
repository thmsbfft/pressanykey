function Keyboard(parameters) {

	this.el = document.querySelectorAll('main')[0];
	this.canvas = document.getElementsByTagName('canvas')[0];

	paper.setup(this.canvas);
	this.attachEvents();

	this.keyboard = undefined;

	this.debug = {
		center: 'undefined'
	}

	// this.resize();
	this.initCanvas();
}

Keyboard.prototype.attachEvents = function() {

	window.addEventListener('keypress', function(e) {

		e.preventDefault();
		var char = String.fromCharCode(e.keyCode);
		console.log(char);

	});

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
	this.keyboard.setPosition(paper.view.viewSize.width - this.keyboard.bounds.width/2, paper.view.viewSize.height/2);
	// console.log(this.keyboard.bounds);

	paper.view.draw();

}

Keyboard.prototype.initCanvas = function() {

	console.log('Init');

	// Debug
	this.debug.center = new paper.Shape.Circle(new paper.Point(80, 50), 2);
	this.debug.center.fillColor = "red";

	// Keyboard Init
	this.keyboard = paper.project.importSVG(document.getElementById('keyboard_svg')).children[0];
	this.keyboard.strokeWidth = 1; 

	this.resize();

}