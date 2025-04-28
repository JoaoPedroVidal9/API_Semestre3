const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '10.89.240.71', // IP ou localhost
  user: 'alunods', // alunods
  password: 'senai@604', // 
  database: 'semestre3'
});

module.exports = pool;
