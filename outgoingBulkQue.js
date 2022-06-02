const mysqlConnection = require("./db_config");
const sms = require("./sendSMS.js");
logOutgoing = (sender, phone, message,uniqueID) => {
    var sql = "INSERT INTO outgoing_bulk_sms (sender_name, msisdn, message, unique_id, delivery_status, processed, out_date) VALUES ('"+sender+"', '"+phone+"','"+message+"','"+uniqueID+"','',0,'"+curDate()+"')";
    mysqlConnection.query(sql, (err,rows) => {
      if(err) throw err;
      console.log('Data Qued On Outgoing SMS Table:');
      console.log(rows);
    });
  }

  testingStupidFunc = ()=>{
    var sql = "select * from outgoing_bulk_sms where processed=0";
    mysqlConnection.query(sql, (err,rows) => {
      if(err) throw err;
      if(rows.length >= 1)
      {

      }
      else
      {

      }
    });
  }

  logOutgoingDlr = (requestID,requestTimestamp,channel,operation, traceID ,phone ,cpid, correlatorId ,dlrStatus ,campaignID)=>{
    var sql = "INSERT INTO bulk_dlrs (request_id, chanell, operation, trace_id, phone, cpid, correlatorId, dlrStatus, campaignID, request_ts) VALUES ('"+requestID+"', '"+channel+"','"+operation+"','"+traceID+"','"+phone+"', '"+cpid+"','"+correlatorId+"','"+dlrStatus+"','"+campaignID+"','"+requestTimestamp+"')";
    mysqlConnection.query(sql, (err,rows) => {
      numRows = rows.affectedRows;
      if(err) throw err;
      updateDlr(correlatorId,dlrStatus);
      console.log('Received Delivery For  Request ID :' + correlatorId);
      // console.log(rows);
    });
  }
  updateDlr = (correlatorId,dlrStatus)=>{
      mysqlConnection.query("UPDATE messagedetails SET status='"+dlrStatus+"' dlr='"+dlrStatus+"' WHERE message_id='"+correlatorId+"'",(err,rows,fields)=>{
        if(!err){
            console.log('Delivery Report Updated : ' + correlatorId);
        }
        else{
            sql = "UPDATE messagedetails SET delivery_status='"+dlrStatus+"' WHERE unique_id='"+correlatorId+"'";
            console.log('Error Updating Delivery Status at here' + err + sql);
        }
    });
  }
  // while(true){
  // logOutgoing('COSMERE','254725597552','TEST MESSAGE');
  // }

  //create endpoint for creating contact groups *
  //create endpoint for inserting data into the contact groups *
  //create endpoint for getting groups *
  //get the group table name
  //get all the contacts from that table
  //get the sender id
  //check if client has enough units
  //get the message id
  //que the message, another script will handle the sending sms part
  queMsg= () => {
    var sql = "select * from que_msg where processed=0";
    mysqlConnection.query(sql, (err,rows) => {
        numRows = rows.affectedRows;
      if(err) throw err;
      if(rows.length >= 1)
      {
        for (var resp of rows){
          contacts_table = resp.contacts_table;
          id = resp.id;
          sender = resp.sender_name;
          message = resp.message;
          startLoging(sender,message,contacts_table);
          //log outgoing
          //update que_ms processed to 1
          updateQueTable(id);
        }

        console.log('Adding Contacts Que : ' + rows.length);
      }
      else
      {

      }
    });
  }
  startLoging = (sender,message,contacts_table) =>{
    // console.log('Sender Name : '+ sender);
    var sql = "select * from "+ contacts_table;
    mysqlConnection.query(sql, (err,rows) => {
      if(err) throw err;
      if(rows.length >= 1)
      {
        for (var resp of rows){
          contacts_table = resp.contacts_table;
          console.log(resp.id);
          logOutgoing(sender, resp.phone, message,sms.uniqueID(5));
          //log outgoing
        }

        console.log('Logging Contacts : ' + contacts_table);
      }
      else
      {
        console.log('No Contacts In Table : ' + contacts_table);
      }
    });
  }

  updateQueTable = (id)=>{
    var sql = "UPDATE que_msg SET processed='1' WHERE id='"+id+"'";
    mysqlConnection.query(sql,(err,rows,fields)=>{
      if(!err){
          console.log('Que Table Updated : ' + id);
      }
      else{
          console.log('Error Updating Que Table ' + err + sql);
      }
  });
  }

  module.exports = {
    logOutgoing,
    logOutgoingDlr,
    testingStupidFunc,
    queMsg
  }
