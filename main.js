const { app, BrowserWindow,ipcMain,screen} = require('electron')
const path = require('path')
const { createTransaction, createServices, createRollback, createExpenditure, createConcerns,
    createSalaryUpdate, createEmployees, createEmployee, createProfile, createSettings,
    createReports,createReward, createClients,createNewService
} = require('./manage/manager')
const { print } = require('./receipt')
const { connectDB,disconnectDB } = require('./database/db')
const { count } = require('console')

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
ipcMain.on('all_employees', (event, args) => {
    let sql = "SELECT * FROM employees"
    db.all(sql, [], (err, row) => {
        if (err) {
            return console.log(err.message)
        }
        event.sender.send('employees',row)
    })
})
ipcMain.on('revenue', (event, args) => {
    let sql = "SELECT amount FROM transactions"
    db.all(sql, [], (err, row) => {
        if (err) {
            return console.log(err.message)
        }
        event.sender.send('all_revenue',row)
    })
})
ipcMain.on('table_data', (event, args) =>{
    let sql = "SELECT * FROM transactions"
    db.each(sql, [], (err, row) => {
        if (err) {
            return console.log(err.message)
        }
        event.sender.send('all_transactions',[row])

    })
})

ipcMain.on('add_employee', (event, args) => {
    // db.run("CREATE TABLE IF NOT EXISTS employees (first_name NOT NULL,last_name NOT NULL, phone_number NOT NULL,employee_type NOT NULL,payment NOT NULL,salary NOT NULL ) ")
     db.run(`INSERT INTO employees (first_name,last_name,phone_number,employee_type,payment,salary) VALUES('${args[0]}','${args[1]}','${args[2]}','${args[3]}','${args[4]}','${args[5]}')`)
})

ipcMain.on('reward_points', (event, args) => {
    // db.run("CREATE TABLE IF NOT EXISTS clients (first_name NOT NULL,last_name NOT NULL,plate_number NOT NULL, points INTEGER DEFAULT 0 NOT NULL, date DATE)")
    var sql = db.run(`INSERT INTO clients (first_name,last_name,plate_number,points,date) VALUES('${args[0]}','${args[1]}','${args[2]}','${args[3]}','${args[4]}')`)
    if (sql) {
        console.log('Rewards Updated')
    } else {
        console.log('Unable to reward client')
    }
})

ipcMain.on('update_salary', (event, args) => {
    let sql = `SELECT  first_name FROM employees WHERE phone_number = ?`
    db.get(sql, [args[0]], (err,row) => {
        if (err) {
            return console.error(err.message)
        } else if (row != null) {
           db.run(`UPDATE  employees SET payment = '${args[1]}',salary = '${args[2]}' WHERE phone_number = '${args[0]}'`)
            console.log('Update successful')
        } 
        else {
            console.log('No such employee')
        }
    })
})
ipcMain.on('newservice', (event, args) => {
//  db.run("CREATE TABLE IF NOT EXISTS services (service_name NOT NULL,saloon_car,four_wheel_SUVs,bus,trailer,mini_bus,motorcycle)")
   let sql =db.run(`INSERT INTO services (service_name,saloon_car,four_wheel_SUVs,bus,trailer,mini_bus,motorcycle) VALUES('${args}','','','','','','')`)
    if (sql) {
    console.log('service added successfully')
}
})
ipcMain.on('add_service',()=> createNewService(win))
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

ipcMain.on('receipt', (event, args) => {
   let query= db.run(`INSERT INTO transactions (client_firstname,client_lastname,car_plate,service_employee,client_car_type,service_offered,amount,date) VALUES('${args[0]}','${args[1]}','${args[2]}','${args[3]}','${args[4]}','${args[5]}','${args[6]}','${args[7]}')`)
    if (query) {
        console.log('Transaction added sucessfullty')
        print(args[2],args[4],args[6],args[3])
    } else {
        console.log('Unable to add transaction')
    }
    console.log(args)
    // db.run("CREATE TABLE transactions (client_firstname NOT NULL,client_lastname NOT NULL,car_plate NOT NULL,service_employee NOT NULL,client_car_type NOT NULL,service_offered NOT NULL,amount INTEGER NOT NULL,date DATE NOT NULL)")
//    print(args[0], args[1], args[2], args[3]) 
})
    


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


