const { BrowserWindow } = require('electron') 

const webPreferences = {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule:true
}

module.exports = {
    createTransaction: (parent)=>{
        var window = new BrowserWindow({ parent: parent, width: 800, height: 600, modal: true,webPreferences:webPreferences})
       // window.removeMenu(true)
        window.loadFile('./new_transaction.html')
    },
    createExpenseTap: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 700, height: 600, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./expense_tap.html')
    },
    createRollback: (parent)=>{
        var window = new BrowserWindow({ parent: parent, width: 600, height: 450, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./rollback.html')
    },
    createExpenditure: (parent)=>{
        var window = new BrowserWindow({ parent: parent, width: 600, height: 450, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./expenditure.html')
    },
    createServices: (parent)=>{
        var window = new BrowserWindow({ parent: parent, width: 600, height: 450, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./services.html')
    },
    createConcerns: (parent)=>{
        var window = new BrowserWindow({ parent: parent, width: 800, height: 450, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./concerns.html')
    },
    createSalaryUpdate: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 600, height: 400, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./salaryupdate.html')
    },
    createEmployees: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true,webPreferences:webPreferences})
        window.loadFile('./employees.html')
    },
    createEmployee: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 800, height: 500, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./newemployee.html')
    },
    createProfile: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        window.removeMenu(true)
        window.loadFile('./profile.html')
    },
    createSettings: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        window.loadFile('./settings.html')
    },
    createReports: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./reports.html')
    },
    createReward: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 800, height: 500, modal: true, webPreferences: webPreferences })
         window.removeMenu(true)
        window.loadFile('./reward.html')
    },
    createClients: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true, webPreferences: webPreferences })
        window.removeMenu(true)
        window.loadFile('./clients.html')
    },
    createNewService: (parent) => {
        var window = new BrowserWindow({ parent: parent, width: 400, height: 250, modal: true ,webPreferences:webPreferences})
        window.removeMenu(true)
        window.loadFile('./newservice.html')
    },

}

