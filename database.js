const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "greenfin",
  connectTimeout: 30000,
});

exports.pool = pool;
