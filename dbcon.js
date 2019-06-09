var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_framet',
  password        : '8365',
  database        : 'cs340_framet',
  dateStrings     : 'date'
});
module.exports.pool = pool;
