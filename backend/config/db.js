
// mysql2 package lets nodejs talk to database 
const mysql = require('mysql2');

// pool allows for multiple queries at a time / concurrently 
const db = mysql.createPool({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,          // if the connection limit gets reached , then the queries will be queued until a connection is available and limit the number of queued connection requests. 0 means no limit
}).promise();   // enables async/await 



module.exports = db;