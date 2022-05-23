const mysql = require('mysql');

// var mysqlConnection = mysql.createConnection({
//   host:"localhost",
//   user:"root",
//   password:"2erQuGD<;L>aR=c:",
//   database:"sdp_node",
//   multipleStatements:true
// });

var mysqlConnection = mysql.createConnection({
    host:"studiothirtyone.net",
    user:"studiothirtyone_sms",
    password:"p5Y60G.z@ct9YZ",
    database:"studiothirtyone_bulk_sms",
    multipleStatements:true
  });

mysqlConnection.connect((err)=>{
  if(!err)
  {
    console.log('Connected');
  }
  else
  {
    console.log('Could Not Connect ' + err);
  }
});

global.curDate = () => {
  var today = new Date();

  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  return dateTime = date+' '+time;
}
module.exports = mysqlConnection;