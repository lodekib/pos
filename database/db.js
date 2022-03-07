let sqlite3 = require('sqlite3')
let db
module.exports ={
    connectDB: () => {
        db =  new sqlite3.Database('database/splash.db', (err) => {
            if (err) {
             return console.error(err.message)
            } else {
                console.log('DB connection successful')
         }
        })
     return db   
    },
    disconnectDB: () => {
        db.close((err) => {
            if (err) {
                console.log('Unable to close database')
            } else {
                console.log('DB closed successful')
            }
        })
    }
}