var App = {

	container: undefined,

	init: function(container) {
		this.container = container;
		Loader.init();
		this.initialLoad();
	},

	initialLoad: function() {
		Loader.load([
			{id: 'homepage', src: 'data/homepage.html'}
		], this.loadCompleted.bind(this));
	},

	loadCompleted: function() {
		this.container.innerHTML = Loader.getContentById('homepage');
		this.initialTransitionIn();
		Keyboard = new Keyboard();
		Toot = new Toot();
	},

	initialTransitionIn: function() {
		this.container.classList.add('fade-in');
	},

	dispose: function() {
		this.container.innerHTML = '';
	}

};