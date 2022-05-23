console.log('Starting Script');
//npm dependencies
const axios = require('axios');
const express = require('express');
const mysql = require('mysql');

const sendSms = require('./sendSMS.js');
const mysqlConnection = require("./db_config");
const Router = express.Router();

 // Make a request for a user with a given ID
 ignite = () =>{
    axios.get('http://localhost:9000/outgoingBulk/count')
    .then(function (response) {
      // handle success
    var obj =  response.data;
    // console.log("after getting bulk count : " + JSON.stringify(response.data));
    // return;
    // processOutgoing(obj);
    for (var resp of obj){
      var num = resp.count;
      checkUnprocessed(num);
    }
    console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed

    });
 }

processOutgoing = (smsObj) => {
  for (var resp of smsObj){
    var id = resp.id;
    var sender = resp.sender_id;
    var phone = resp.recipient;
    var message = resp.message;
    var uniqueID = resp.id;
    sendSMS(phone,message,sender,uniqueID);
    //send sms
    updateProcessed(id);
    // console.log(`ID : ${id} : Sender Name :  ${sender} :  Phone : ${phone} Message : ${message}`);
    }
}
checkUnprocessed = (num) => {
  if(num >=1 ){
    axios.get('http://localhost:9000/outgoingBulk')
    .then(function (response) {
      // handle success
    var obj =  response.data;
    processOutgoing(obj);
    // console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      // console.log(error);
    })
    .then(function () {
      // always executed
    });
  }
  else
  {
    console.log('No Outgoing SMS To Process');
  }
}
async function sendSMS(phone,msg,sender,uniqueID){

  axios.get('http://localhost:9000/outgoingBulk/getTokens')
  .then(function (response) {
  // handle success
  var obj =  response.data;
  
  // processOutgoing(obj);
  for (var resp of obj){
  var tokens = resp.token;
  // console.log("At send sms geting token : " + tokens);
  sendSms.sendBulkSMS(tokens,phone,msg,sender,uniqueID);
  }
  // console.log(response.data);
  })
  .catch(function (error) {
  // handle error
  console.log(error);
  }).then(function () {
  // always executed
});
}
tumatext = (phone,msg,sender,uniqueID) => {
  sendSMS(phone,msg,sender,uniqueID);
}
updateProcessed = (id)=>{
  axios.post('http://localhost:9000/outgoingBulk/updateProcessed',{id:id}).then(function (response) { 
    //write the response to a file or something console.log(response.data);
    console.log("Database updated");
 });
}
// console.log(updateProcessed(2935));

module.exports = {
  ignite,
  tumatext
}