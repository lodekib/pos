const { BrowserWindow } = require('electron') 

module.exports = {
    createTransaction: (parent)=>{
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/new_transaction.html')
    },
    createRollback: (parent)=>{
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/rollback.html')
    },
    createExpenditure: (parent)=>{
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/expenditure.html')
    },
    createServices: (parent)=>{
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/services.html')
    },
    createConcerns: (parent)=>{
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/concerns.html')
    },
    createSalaryUpdate: (parent) => {
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/salaryupdate.html')
    },
    createEmployees: (parent) => {
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/employees.html')
    },
    createEmployee: (parent) => {
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/newemployee.html')
    },
    createProfile: (parent) => {
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/profile.html')
    },
    createSettings: (parent) => {
        var transWindow = new BrowserWindow({ parent: parent, width: 1000, height: 500, modal: true })
        transWindow.loadFile('./manage/settings.html')
    },
    
}

