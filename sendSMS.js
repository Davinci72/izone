process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
sendBulkSMS = (token,phone,msg,sender,uniqueID) => {
    // var timestamp = curDateTime();
    timestamp = Date.now();
    var resultUrl = 'http://studiothirtyone.net:9000/outgoingBulk/bulkDlr';
    var sendSmsUrl = 'https://dsvc.safaricom.com:9480/api/public/SDP/sendSMSRequest';
    // uniqueID = rand('1000','10000000');
   
    var rawJson = {
        "timeStamp": timestamp,
        "dataSet": [
          {
            "userName": "rhodenneAPI",
            "channel": "sms",
            "packageId": "7079",
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
