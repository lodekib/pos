const { Certificate } = require('crypto')
const { app, BrowserWindow,ipcMain,screen} = require('electron')
const path = require('path')
const url = require('url')
const { createTransaction, createServices, createRollback, createExpenditure, createConcerns,
    createSalaryUpdate,createEmployees,createEmployee,createProfile,createSettings
} = require('./manage/manager')

let win
let win2
let child
function createWindows() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({ width: width,modal:true,height: height,show: false,webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        } 
    })
    // win.removeMenu(true)
    win.loadFile(path.join(__dirname, './manager.html'),)
    win2 = new BrowserWindow({width: width,  height: height,show: false,webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

    })
    win2.loadFile(path.join(__dirname,'./admin.html'))
    
    child = new BrowserWindow({opacity: 0.75,roundedCorners:true,transparent:true, width: width,height: height,frame: true,webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        }
    })
     child.removeMenu(true)
    child.loadFile(path.join(__dirname, './login.html'))
    
}

ipcMain.on('manager', (arg) => {
        win.show()
        child.hide()       
})
ipcMain.on('admin', () => {
    win2.show()
    child.hide()
})
ipcMain.on('transaction', () => createTransaction(win))
ipcMain.on('rollback', () => createRollback(win))
ipcMain.on('expenditure', () => createExpenditure(win))
ipcMain.on('services', () => createServices(win))
ipcMain.on('concerns', () => createConcerns(win))
ipcMain.on('updatesalary', () =>createSalaryUpdate(win))
ipcMain.on('employees', () =>createEmployees(win))
ipcMain.on('newemployee', ()=> createEmployee(win))
ipcMain.on('profile', () => createProfile(win))
ipcMain.on('settings',()=> createSettings(win))
ipcMain.on('logout',()=> child.show())

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


