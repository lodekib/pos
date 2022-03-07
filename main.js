const { app, BrowserWindow,ipcMain,screen} = require('electron')
const path = require('path')
const { createTransaction, createServices, createRollback, createExpenditure, createConcerns,
    createSalaryUpdate, createEmployees, createEmployee, createProfile, createSettings,
    createReports,createReward, createClients
} = require('./manage/manager')
const { print } = require('./receipt')
const { connectDB,disconnectDB } = require('./database/db')

let win
let win2
let child
let printers
let db = connectDB()
 function  createWindows(){
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({ width: width,modal:true,height: height,show: false,webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
     
        } 
    })
    printers = win.webContents.getPrintersAsync()
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
    //  child.removeMenu(true)
    child.loadFile(path.join(__dirname, './login.html'))
    
}

ipcMain.on('manager', (event, args) => {
    console.log(args)
    // db.run("CREATE TABLE IF NOT EXISTS manager (email TEXT PRIMARY KEY,user NOT NULL,password NOT NULL)")
    // if (args != null) {
    //     db.run(`INSERT INTO manager(email,user,password) VALUES('${args[0]}','${args[1]}','${args[2]}')`)
    // }
    let sql = `SELECT password FROM manager WHERE email = ?`
    db.get(sql, [args[0]], (err, row) => {
        if (err) {
            return console.error(err.message)
        }else if (row.password == args[2]) {
            win.show()
            child.hide()
        } else {
          console.log('Invalid credentials')        }
    })
       
    win.show()
    child.hide()
  
})

ipcMain.on('add_employee', (event, args) => {
    // db.run("CREATE TABLE IF NOT EXISTS employees (first_name NOT NULL,last_name NOT NULL, phone_number NOT NULL,employee_type NOT NULL,payment NOT NULL,salary NOT NULL ) ")
     db.run(`INSERT INTO employees (first_name,last_name,phone_number,employee_type,payment,salary) VALUES('${args[0]}','${args[1]}','${args[2]}','${args[3]}','${args[4]}','${args[5]}')`)
    console.log(args)
})
ipcMain.on('updatesalary', (event, args) => {
    
    console.log(args)
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
ipcMain.on('settings', () => createSettings(win))
ipcMain.on('reports', () => createReports(win))
ipcMain.on('reward', () => createReward(win))
ipcMain.on('clients', () => createClients(win))
ipcMain.on('logout', () => child.show())

ipcMain.on('receipt', (event,args) => print(args[0],args[1],args[2],args[3]))


ipcMain.on('admin', () => {
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


