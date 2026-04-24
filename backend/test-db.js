const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    console.log("-> Connected to MySQL server successfully!");
    
    // Check if database exists
    const [dbs] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    if (dbs.length === 0) {
      console.log(`-> Database '${process.env.DB_NAME}' DOES NOT EXIST.`);
    } else {
      console.log(`-> Database '${process.env.DB_NAME}' exists.`);
      
      await connection.query(`USE ${process.env.DB_NAME}`);
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`-> Tables found: ${tables.length}`);
      tables.forEach(t => console.log(Object.values(t)[0]));
    }

    await connection.end();
  } catch (err) {
    console.error("-> Failed to connect to MySQL Server:", err.message);
  }
}

testConnection();
