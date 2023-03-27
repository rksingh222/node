npm install --save mysql2
//util//database.js
const mysql = require('mysql2');
const pool = mysql.createPool({
host: 'localhost', // since its running in local machine
user: 'root',
database: 'node-complete',
password: 'nodecomplete'
});

module.exports = pool.promise(); // will allow to work with promises like async code

/app.js
const db = require('./util/database.js');
db.execute('SELECT * FROM products').then(result =>{
  console.log(result);
  console.log(result[0],result[1]);
}).catch(err => {
  console.log(err);
}); //right click and create table
