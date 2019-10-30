const { app, BrowserWindow, systemPreferences, nativeTheme } = require('electron')
const fs = require('fs')
const path = require('path')
const http = require('http')

let mainWindow
let contents
let darkReaderJs
let darkCSS
let darkCSSKey

function createWindow () {
  mainWindow = new BrowserWindow({width: 1024, height: 768})
  mainWindow.loadURL('https://photos.google.com/')
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  contents = mainWindow.webContents

  if (process.platform === 'darwin') {
    darkCSS = fs.readFileSync(path.join(__dirname, 'dark.css'), 'utf8')
    darkReaderJs = fs.readFileSync(path.join(__dirname, 'darkreader.js'), 'utf8')
    contents.on('dom-ready', () => {
      contents.executeJavaScript(darkReaderJs)
      updateTheme()
    });
    systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', updateTheme)
  }
}

function updateTheme() {
  if(nativeTheme.shouldUseDarkColors) {
    contents.executeJavaScript(`
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10
    });`)
    contents.insertCSS(darkCSS).then(value => { darkCSSKey = value })
  } else if(darkCSSKey !== null) {
    contents.executeJavaScript(`
      DarkReader.disable();
    `)
    contents.removeInsertedCSS(darkCSSKey).then(() => { darkCSSKey = null })
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
