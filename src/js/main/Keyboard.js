function Keyboard() {

	app.on('window-all-closed', function() {
	    app.quit();
	});

	// @if NODE_ENV='development'
	c.log('[Keyboard] ✔');
	// @endif

	this.outputFolder = app.getPath('home') + '/pressanykey/';
	c.log(this.outputFolder);

	this.isFullScreen = false;
	this.browserWindow = new BrowserWindow({
	  width: 1500,
	  height: 700,
	  frame: false,
	  backgroundColor: '#141414',
	  show: false,
	  minWidth: 600,
	  minHeight: 350,
	  darkTheme: true,
	});

	this.browserWindow.loadURL('file://' + __dirname + '/src/html/index.html' + '#' + this.id);

	this.attachEvents();

	// @if NODE_ENV='development'
	this.browserWindow.webContents.openDevTools();
	// @endif

}

Keyboard.prototype.attachEvents = function() {

	this.browserWindow.webContents.on('dom-ready', this.onReady.bind(this));

	// ipcMain.on('print', function(event, text, svg) {
	// 	this.startPrinting(text, svg);
	// }.bind(this));

	ipcMain.on('print', function(event, text, blob) {
		this.startPrinting(text, blob);
	}.bind(this));

}

Keyboard.prototype.onReady = function() {

	this.browserWindow.webContents.send('ready');
	this.browserWindow.show();

}

Keyboard.prototype.toggleFullScreen = function() {

	// @if NODE_ENV='development'
	c.log('FULLSCREEN');
	// @endif

	this.isFullScreen = !this.isFullScreen;
	this.browserWindow.setFullScreen(this.isFullScreen);

}

Keyboard.prototype.decodeBase64Image = function(dataString) {

	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
	    response = {};

	  if (matches.length !== 3) {
	    return new Error('Invalid input string');
	  }

	  response.type = matches[1];
	  response.data = new Buffer(matches[2], 'base64');

	  return response;

}

Keyboard.prototype.startPrinting = function(text, blob) {

	var day = pad(new Date().getDate());
	var month = pad(new Date().getMonth() + 1);
	var year = new Date().getFullYear();
	var date = day + '-' + month + '-' + year;

	var hrs = pad(new Date().getHours());
	var min = pad(new Date().getMinutes());
	var sec = pad(new Date().getSeconds());
	var time = hrs + '-' + min + '-' + sec;

	var svgFileName = date + '-' + time + '.svg';
	var pngFileName = date + '-' + time + '.png';
	var jpgFileName = date + '-' + time + '.jpg';

	var imageBuffer = this.decodeBase64Image(blob);

	fs.writeFile(this.outputFolder + jpgFileName, imageBuffer.data, function(err) {
		if(err) throw err;
		c.log('Saved');
	}.bind(this));

	// fs.writeFile(this.outputFolder + jpgFileName, blob, 'binary', function(err) {
	// 	if (err) throw err;
	// 	c.log('Saved');
	// }.bind(this));

	// fs.writeFile(this.outputFolder + svgFileName, svg, function(err) {
	// 	// @if NODE_ENV='development'
	// 	if(err) c.log(err);
	// 	// @endif
	// });

	// svg_to_png.convert(this.outputFolder + svgFileName, this.outputFolder, {defaultWidth: "384px"})
	// .then( function(){
	// 	c.log('Converting for printer');
	// 	// gm(this.outputFolder + pngFileName)
	// 	// 	.resize(384)
	// 	// 	.write(this.outputFolder + pngFileName, function(err) {
	// 	// 		if(!err) c.log('Done converting');
	// 	// 		if(err) c.log(err);
	// 	// 	});
	// 		// .background('white')
	// 		// .flatten()
	// 		// .toFormat('jpg')
	// 		// .write(this.outputFolder + jpgFileName, function(err) {
	// 		// 	if(err) throw err;
	// 		// 	// @if NODE_ENV='development'
	// 		// 	if(!err) c.log('Done converting');
	// 		// 	// @endif
	// 		// });
	// }.bind(this));

	// @if NODE_ENV='development'
	c.log('PRINTING');
	// c.log(text);
	// c.log(svg);
	// @endif

}