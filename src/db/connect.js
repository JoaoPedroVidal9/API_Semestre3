const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost', // IP ou localhost
  user: 'alunods', // alunods
  password: 'senai@604', // 
  database: 'semestre3'
});

module.exports = pool;
