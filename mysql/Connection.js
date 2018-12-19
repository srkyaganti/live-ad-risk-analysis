


const mysql      = require('mysql');
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'live-ad-risk-db.cxtxk2crdbbz.us-east-1.rds.amazonaws.com',
    user            : 'gkurapat',
    password        : 'syyagant',
    database        : 'booker'
  });
  module.exports = pool;
  /*
  pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });

*/
/*
var connection = mysql.createConnection({
  host     : 'live-ad-risk-db.cxtxk2crdbbz.us-east-1.rds.amazonaws.com',
  user     : 'gkurapat',
  password : 'syyagant'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});
*/

