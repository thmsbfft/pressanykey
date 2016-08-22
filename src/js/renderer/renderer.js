'use strict';
var ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const clipboard = remote.clipboard;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

var fs = require('fs');
var os = require('os');
var path = require('path');

ipcRenderer.on('ready', function() {
	
	console.log('[IPC] ☑️');
	Keyboard = new Keyboard();

})