const mysql = require('mysql');
const db = mysql.createConnection(
    {
        user: 'root',
        host: 'localhost',
        password: 'admin',
        database : 'mydb'
    }
)
module.exports = db;