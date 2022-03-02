const { Certificate } = require('crypto')
const { app, BrowserWindow,ipcMain,screen} = require('electron')
const path = require('path')
const url = require('url')
let win
var isManager
let win2
let child
function createWindows() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({
        width: width,
        modal:true,
        height: height,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        }
       
    })
    // win.removeMenu(true)
    win.loadFile(path.join(__dirname, '/manager/index.html'),)

    win2 = new BrowserWindow({
        width: width,
        height: height,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

    })
    win2.loadFile(path.join(__dirname,'/admin/index.html'))
    

    child = new BrowserWindow({
        opacity: 0.75,
        roundedCorners:true,
        transparent:true,
        width: width,
        height: height,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        }
    })
     child.removeMenu(true)
    child.loadFile(path.join(__dirname, 'login.html'))

}

ipcMain.on('manager', (arg) => {
    console.log('showing manager dashboard')
        win.show()
        child.hide()
        
})
ipcMain.on('admin', () => {
    console.log('showing admin dashboard')
    win2.show()
    child.hide()
})

app.whenReady().then(() => {
    createWindows()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindows()
        }
    })
})

app.on('all-windows-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


