process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
sendBulkSMS = (token,phone,msg,sender,uniqueID) => {
    // var timestamp = curDateTime();
    timestamp = Date.now();
    var resultUrl = 'https://studiothirtyone.net:9000/outgoingBulk/bulkDlr';
    var sendSmsUrl = 'https://dtsvc.safaricom.com:8480/api/public/CMS/bulksms';
    // uniqueID = rand('1000','10000000');
   
    var rawJson = {
        "timeStamp": timestamp,
        "dataSet": [
          {
            "userName": "rhodenne",
            "channel": "sms",
            "packageId": "8832",
            "oa": sender,
            "msisdn": phone,
            "message": msg,
            "uniqueId": uniqueID,
            "actionResponseURL": resultUrl
          }
        ]
      }
      console.log(rawJson);
    axios.post(sendSmsUrl,rawJson,{headers: {
        'Content-Type': 'application/json',
        'X-Authorization':'Bearer '+token
    }}).then(function(response) { 
    //write the response to a file or something 
    // console.log("checking the headers json at send sms : " + JSON.stringify(headers));
    // return;
    console.log(response.data);
 }).catch(function(err){
     console.log(err);
 });
}
curDateTime = () =>{
    today = new Date();
    return Math.floor(today / 100);
}

uniqueID = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
// console.log(uniqueID(5));
module.exports = {
    sendBulkSMS,
    uniqueID,
    curDateTime
}