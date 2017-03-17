'use strict';
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// adds debug features like hotkeys for triggering dev tools and reload
var indexFile = `${__dirname}/app/index.html`;

// Turn off pinch to zoom.
//
// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
		width: 400,
		height: 600,
		titleBarStyle: 'hidden-inset',
		show: false,
		background: "#282828",
		vibrancy: 'light',
		resizable: false,
		fullscreenable: false,
		title: "Penguin Icon Manager",
		icon: path.join(__dirname, 'assets/logo/icon_32x32@2x.png')
	});

	if (process.env['NODE_ENV'] === 'dev') {
		// we need to wait until browsersync is ready
		setTimeout(function() {
			console.log("booting up")
			win.loadURL(url.format({
		    pathname: indexFile,
		    protocol: 'file:',
		    slashes: true,
		  }));
			win.show()
		}, 7000);
	} else {
		win.loadURL(url.format({
	    pathname: indexFile,
	    protocol: 'file:',
	    slashes: true,
	  }));

		win.once('ready-to-show', () => {
			win.show()
		})
	}

	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
		app.quit();
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
