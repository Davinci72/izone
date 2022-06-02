process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const mysqlConnection = require('./db_config.js');
const axios = require('axios');
var apiUsername = 'rhodenne';
var apiPassword = 'RHODENNEAPI@ps584';
var apiCredentialsEndpoint = 'https://dsvc.safaricom.com:9480/api/auth/login';
//var apiCredentialsEndpoint = 'http://localhost/sms/test.php';

// const res = axios.post(apiCredentialsEndpoint,{username:apiUsername,password:apiPassword},{
//     headers: {
//         "cache-control": "no-cache",
//             "content-type": "application/json",
//             "x-requested-with": "XMLHttpRequest"
//     }
    
// }).then(response =>  { return response; }).catch(err =>{
//     console.log(err);
//   });
// console.log(res);

function getTokens(){
    return axios.post(apiCredentialsEndpoint,{username:apiUsername,password:apiPassword},{
            headers: {
                "cache-control": "no-cache",
                    "content-type": "application/json",
                    "x-requested-with": "XMLHttpRequest"
            }
        });
}

logTokens = (msg, token, refereshToken) => {
    var sql = "INSERT INTO 	authentication (msg, token, refresh_token, date_c) VALUES ('"+msg+"', '"+token+"','"+refereshToken+"','"+curDate()+"')";
    mysqlConnection.query(sql, (err,rows) => {
      if(err) throw err;
      console.log('Tokens Inserted In Db:');
    //   console.log(rows);
    });
  }

//check if db is empty then get tokens, else update tokens
getCountTokens = ()=>{
    var sql = "SELECT count(*) as count FROM authentication";
    mysqlConnection.query(sql, (err,rows) => {
      if(err) throw err;
        for (var resp of rows){
            var c = resp.count;
            if(c >=1)
            {
                //get the token
                getTokens().then(function(response){
                    //log to a database
                    //get the id
                    getIdToUpdate(response.data.token);
                    // logTokens(response.data.msg,response.data.token, response.data.refreshToken);
                    // console.log(response.data);
                    console.log('Updating Existing Token tier one :');
                    return;
                }).catch(function(err){
                    console.log('Error Updating Existing Token :' + err);
                });
            }
            else
            {
                getTokens().then(function(response){
                    //log to a database
                    logTokens(response.data.msg,response.data.token, response.data.refreshToken);
                    console.log('Creating New Token since there were no existing tokens : ');
                }).catch(function(response){
                    console.log("New tokens Received");
                });
            }
        }
    });
}
getIdToUpdate = (token) => {
    var sql = "SELECT * FROM authentication";
    mysqlConnection.query(sql, (err,rows) => {
        if(err) throw err;
        for (var resp of rows){
            // console.log(resp.id);
            //perform an update
            updateREfreshToken(token,resp.id);
            // console.log("token to update is :" + token + "ID To update is " + resp.id);
        }
        //if i do return rows; i get undefined
        // console.log(rows);
    });
}
updateREfreshToken = (token,id)=>{
    mysqlConnection.query("UPDATE authentication SET token='"+token+"' WHERE id="+id,(err,rows,fields)=>{
        if(!err){
            console.log("updating tokens bro: ");
        }
        else{
            sql = "UPDATE authentication SET token="+token+" WHERE id="+id;
            console.log('Error Updating Authentication token ' + err + sql);
        }
    });
}
// let i = 0;
// setInterval(() => {
//     getCountTokens();
//     console.log('Token Script Running', i++);
// }, 20000);
module.exports = {
    getCountTokens
}




