const { app, BrowserWindow,ipcMain,screen} = require('electron')
const path = require('path')
const { createTransaction, createServices, createRollback, createExpenditure, createConcerns,
    createSalaryUpdate, createEmployees, createEmployee, createProfile, createSettings,
    createReports,createReward, createClients,createNewService
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
     console.log('Printers :'+printers)
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
        } else{
          event.sender.send('login_error','Invalid Credentials')
        }
    })     

})
ipcMain.on('all_employees', (event, args) => {
    let sql = "SELECT * FROM employees"
    db.all(sql, [], (err, row) => {
        if (err) {
            return console.log(err.message)
        } else if(row.length <1){
            event.sender.send('no_employee','No employees Available')
        } else {
            event.sender.send('employees', row.reverse())
        }
        
    })
})
ipcMain.on('revenue', (event, args) => {
    let sql = "SELECT amount FROM transactions"
    db.all(sql, [], (err, row) => {
        if (err) {
            return console.log(err.message)
        } else if (row.length < 1) {
            event.sender.send('no_revenue','No revenue Collected')
        } else {
            event.sender.send('all_revenue', row.reverse())

        }
    })
})
ipcMain.on('table_data', (event, args) =>{
    let sql = "SELECT * FROM transactions"
    db.all(sql, [], (err, row) => {
        if (err) {
            return console.log(err.message)
        }
        event.sender.send('all_transactions', row.reverse())
    })
})

ipcMain.on('add_employee', (event, args) => {
    // db.run("CREATE TABLE IF NOT EXISTS employees (first_name NOT NULL,last_name NOT NULL, phone_number NOT NULL,employee_type NOT NULL,payment NOT NULL,salary NOT NULL ) ")
    if (db.run(`INSERT INTO employees (first_name,last_name,phone_number,employee_type,payment,salary) VALUES('${args[0]}','${args[1]}','${args[2]}','${args[3]}','${args[4]}','${args[5]}')`)) {
        event.sender.send('success_addemployee','Employee added successfully')
    } else {
        event.sender.send('error_addemployee', 'Unable to add Employee.Please try again')
    }
  
})

ipcMain.on('reward_points', (event, args) => {
    // db.run("CREATE TABLE IF NOT EXISTS clients (first_name NOT NULL,last_name NOT NULL,plate_number NOT NULL, points INTEGER DEFAULT 0 NOT NULL, date DATE)")
    let sql = `SELECT first_name,plate_number,points FROM clients WHERE last_name =?`
    db.all(sql, [args[1]], (err, row) => {
        if (row.length > 0) {
           let new_points = parseInt(row[0].points) + parseInt(args[3])
            if (db.run(`UPDATE clients SET points = '${new_points}' WHERE first_name = '${args[0]}' AND last_name = '${args[1]}'`)) {
               event.sender.send('success_updatepoints','Client Points Updated Successfully')
            } else {
                event.sender.send('error_updatepoints','Unable to Update Client Points')
           }
        } else{
            if (db.run(`INSERT INTO clients (first_name,last_name,plate_number,points,date) VALUES('${args[0]}','${args[1]}','${args[2]}','${args[3]}','${args[4]}')`)) {
                event.sender.send('success_addreward', 'Client Awarded points successfully')
            } else {
                event.sender.send('error_addreward', 'Unable to reward client')
            }
        }
    })
  
})

ipcMain.on('update_salary', (event, args) => {
    let sql = `SELECT  first_name FROM employees WHERE phone_number = ?`
    db.all(sql, [args[0]], (err,row) => {
        if (err) {
            return console.error(err.message)
        } else if (row.length > 0) {
            if (db.run(`UPDATE  employees SET payment = '${args[1]}',salary = '${args[2]}' WHERE phone_number = '${args[0]}'`)) {
               event.sender.send('success_salaryupdate','Employee Salary/Commission Updated')
            }else{
            event.sender.send('error_salaryupdate','Unable to update Employee salary.Pleas try again later')
           }
            
        } 
        else {
            event.sender.send('no_suchemployee','Employee does not exist.Please provide a valid Employee.')
        }
    })
})
ipcMain.on('newservice', (event, args) => {
//  db.run("CREATE TABLE IF NOT EXISTS services (service_name NOT NULL,saloon_car,four_wheel_SUVs,bus,trailer,mini_bus,motorcycle,pickup,canter,double_cabin)")
   let sql =db.run(`INSERT INTO services (service_name,saloon_car,four_wheel_SUVs,bus,trailer,mini_bus,motorcycle) VALUES('${args}','','','','','','')`)
    if (sql) {
        event.sender.send('success_addservice', 'Service added successfully')    
    } else {
        event.sender.send('error_addservice','Unable to add service.Please try again')
}
})
ipcMain.on('services_and_cars', (event, args) => {
    let sql = "SELECT service_name FROM services"
    db.all(sql, [], (err, row) => {
        if (err) {
            return console.log(err.message)
        }
        if (row.length > 0) {
           event.sender.send('servicesandcars', row.reverse())
        } else {
            event.sender.send('error_serviceandcars','No Services Available')
        }
        
    })
})
ipcMain.on('charges_data', (event, args) => {
    let sql = db.run(`UPDATE services SET ${args[1]} = '${args[2]}' WHERE service_name = '${args[0]}'`)
    if (sql) {
       event.sender.send('success_chargesdata','Service charges updated successfully') 
    } else {
        event.sender.send('error_chargesdata','Unable to update the charges.Please try again')
    }
})
ipcMain.on('rollback_date', (event, args) => {
    let sql = db.run(`DELETE FROM transactions WHERE date = '${args[0]}'`)
    if (sql) {
        event.sender.send('success_rollback','Transaction Rolled back successfully')
    } else {
        event.sender.send('error_rollback','Unable to rollback the transaction')
        
    }
})
ipcMain.on('addexpense', (event, args) => {
    // let sql =db.run("CREATE TABLE IF NOT EXISTS expenses (expense NOT NULL,amount NOT NULL,date DATE NOT NULL)")
    let sql = db.run(`INSERT INTO expenses (expense,amount,date) VALUES ('${args[0]}','${args[1]}','${args[2]}')`)
    if (sql) {
        event.sender.send('success_addexpense','Expense added')
    } else {
        event.sender.send('error_addexpense','Unable to add expense')
    }
})
ipcMain.on('new_complain', (event, args) => {
    //   db.run("CREATE TABLE IF NOT EXISTS complains (employee_name TEXT NOT NULL,complain TEXT NOT NULL,date DATE NOT NULL, status NOT NULL DEFAULT Active)")
    if (db.run(`INSERT INTO complains (employee_name,complain,date,status) VALUES ('${args[0]}','${args[1]}','${args[2]}','Active')`)) {
        event.sender.send('success_addcomplain','Complain Added')
    } else {
         event.sender.send('error_addcomplain','Unable to add the Complain')
    }
})
ipcMain.on('all_complains', (event, args) => {
    db.all("SELECT * FROM complains", [], (err, row) => {
        if (err) {
            return console.log(err.message)
        }
        if (row.length > 0) {
            event.sender.send('allcomplains', row.reverse()) 
        }
    })
})
ipcMain.on('all_employees', (event,args) => {
    db.all("SELECT * FROM employees", [], (err, row) => {
        if (err) {
            console.log(err.message)
        } else if(row.length > 0) {
            event.sender.send('allemployees',row.reverse())
        } else {
            event.sender.send('no_employees','No employees at the moment')
        }
    })
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
ipcMain.on('logout', () => {
    win.close()
    child.show()
})

ipcMain.on('receipt', (event, args) => {
   let query= db.run(`INSERT INTO transactions (client_firstname,client_lastname,car_plate,service_employee,client_car_type,service_offered,amount,date) VALUES('${args[0]}','${args[1]}','${args[2]}','${args[3]}','${args[4]}','${args[5]}','${args[6]}','${args[7]}')`)
    if (query) {
        print(args[2], args[4], args[6], args[3])
        event.sender.send('success_addtransaction','Transaction completed successfully')
    } else {
        event.sender.send('error_addtransaction','Unable to complete transaction')
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


