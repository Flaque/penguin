'use strict';
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// adds debug features like hotkeys for triggering dev tools and reload
var indexFile = `${__dirname}/index.html`;

if (process.env['NODE_ENV'] == 'dev') {
	indexFile = "http://localhost:9999";
}

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
		title: "Penguin SVGs"
	});

	if (process.env['NODE_ENV'] === 'dev') {
		// we need to wait until browsersync is ready
		setTimeout(function() {
			console.log("booting up")
			win.loadURL(indexFile);
			win.show()
		}, 7000);
	} else {
		win.loadURL(`file:${indexFile}`);
	}


	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
