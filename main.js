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

  if (process.platform === 'darwin') {
    darkReaderJs = fs.readFileSync(path.join(__dirname, 'darkreader.js'), 'utf8')
    darkCSS = fs.readFileSync(path.join(__dirname, 'dark.css'), 'utf8')
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.webContents.executeJavaScript(darkReaderJs)
      mainWindow.webContents.insertCSS(darkCSS)
      updateTheme()
    });
    systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', updateTheme)
  }
}

function updateTheme() {
  if(mainWindow !== null) {
    if(nativeTheme.shouldUseDarkColors) {
      mainWindow.webContents.executeJavaScript(`
        DarkReader.enable({
          brightness: 100,
          contrast: 90,
          sepia: 10
      });`)
    } else {
      mainWindow.webContents.executeJavaScript(`
        DarkReader.disable();
      `)
    }
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
