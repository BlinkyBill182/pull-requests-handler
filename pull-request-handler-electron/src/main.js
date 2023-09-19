const { app, Tray, Menu, nativeImage} = require('electron');
const {join} = require("path");
const {getIcon} = require("./utils");
let mainWindow = null;
let tray = null;
app.whenReady().then(() => {
    const iconBase64 = getIcon();
    const icon = nativeImage.createFromDataURL(iconBase64)
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])

    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
})