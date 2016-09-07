var Loader = {

	queue : undefined,

	init: function() {
		this.queue = new createjs.LoadQueue();
		this.queue.on('complete', this.onLoadCompleted);
		this.queue.on('error', this.onLoadError);
		this.queue.on('progress', this.onLoadProgress);
	},

	load: function(manifest, onLoaded) {
		console.log('Loading:', manifest[0].src);
		var q = this.queue;
		q.on('complete', onLoaded);
		q.loadManifest(manifest);
	},

	getContentById: function(id) {
		return this.queue.getResult(id);
	},

	onLoadCompleted: function() {
		console.log('Load Completed');
	},

	onLoadError: function() {
		console.log('Load Error');
	},

	onLoadProgress: function() {
		console.log('.');
	},
	
};