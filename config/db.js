const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'user1',
  password: 'G00dW!11',
  database: 'evaluation_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

module.exports = db;
