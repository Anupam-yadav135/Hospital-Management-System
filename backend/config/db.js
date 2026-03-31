
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
  queueLimit: 0,
}).promise();   // enables asunc/await 

// (async () => {
//   try {
//     await db.query('SELECT 1');
//     console.log('Database connected successfully');
//   } catch (err) {
//     console.error('Database connection failed:', err);
//   }
// })();


module.exports = db;