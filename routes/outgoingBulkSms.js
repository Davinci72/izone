const express = require('express');
const mysql = require('mysql');
const outgoing = require('../outgoingBulkQue');
const tumaNow = require('../outgoingBulk.js');
const sms = require('../sendSMS');
const mysqlConnection = require("../db_config");
const Router = express.Router();
const { body, validationResult } = require('express-validator');

Router.get("/",(req, res)=>{
    mysqlConnection.query("SELECT * FROM messagedetails WHERE duration=0 LIMIT 20",(err,rows,fields)=>{
        if(!err){
            // console.log(rows);
            res.send(rows);
            //send the message
            //update the message sent status
            //wait for the delivery report
            //update the sent sms table with the correct dlr
        }
        else{
            console.log('Error Fetching Data ' + err);
        }
    });
});
Router.post("/updateProcessed",(req, res)=>{
    var id = req.body.id;
    // res.send(id);
    mysqlConnection.query("UPDATE messagedetails SET duration=1 WHERE id="+id,(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }
        else{
            sql = "UPDATE messagedetails SET duration=1=1 WHERE id="+id;
            console.log('Error Updating Data ' + err + sql);
        }
    });
});

Router.post('/queMsgContacts',
body('contact_group')
.not().isEmpty()
.isLength({ min: 5 })
.withMessage('should not be an empty string'),
body('message')
    .not().isEmpty()
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long, Should not be an empty string'),
    (req, res)=>{
        groupName = req.body.contact_group;
        message = req.body.message;
        logQue(groupName,message);
        res.send({type:"success",msg:"Messages Qued For Contact Group : "+ groupName});
    //contact group
    //message
});

Router.post('/createContact',
body('contact_group')
.not().isEmpty()
.isLength({ min: 5 })
.withMessage('should not be an empty string'),
body('phone')
    .not().isEmpty()
    .isLength({ min: 12 })
    .withMessage('must be at least 12 chars long, Should not be an empty string'),
    body('FirstName')
    .not().isEmpty()
    .isLength({ min: 1 })
    .withMessage('must be at least 1 chars long, Should not be an empty string'),
    body('LastName')
    .not().isEmpty()
    .isLength({ min: 1 })
    .withMessage('must be at least 1 chars long, Should not be an empty string'),
    (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
            return res.status(400).json({ errors: errors.array() });
        }
        groupName = req.body.contact_group;
        phone = req.body.phone;
        fname = req.body.FirstName;
        lname = req.body.LastName;
        logContact('1', phone,fname,lname,groupName);
        res.send({type:"success",msg:"Contact Added To  Group : "+ groupName});
    //contact group
    //message
});

Router.post('/createContactsGroup', 
    body('group_name')
    .not().isEmpty()
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long, And should not be an empty string'),
    (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        return res.status(400).json({ errors: errors.array() });
    }
    tableName = req.body.group_name;
    //log the group name in a table for future references
    sqlQuery = "CREATE TABLE "+ tableName +" (ID int NOT NULL AUTO_INCREMENT,user_id int NOT NULL, phone varchar(25) NOT NULL,FirstName varchar(255), LastName varchar(255), PRIMARY KEY (ID))";
    mysqlConnection.query(sqlQuery,(err,rows,fields)=>{
        if(!err){
            // console.log(rows);
            // console.log(sqlQuery);
            logContactGroup(tableName);
            res.send({response:'Contact Group ' + tableName + ' Created'});
        }
        else{
            console.log(err.code);
            if(err.code == "ER_TABLE_EXISTS_ERROR")
            {
                res.send({ type:"error",response:'Error  : Contact Group ' + tableName + ' Already Exists'});
            }
            else
            {
                console.log('Error Updating Data ' + err + sqlQuery);
            }
            // console.log('Error Updating Data ' + err + sqlQuery);
        }
    });
});

logContactGroup = (groupName) => {
    var sql = "INSERT INTO contact_groups (user_id, group_name, date_created) VALUES ('1', '"+groupName+"','"+ curDate() +"')";
    mysqlConnection.query(sql, (err,rows) => {
      numRows = rows.affectedRows;
      if(err) throw err;
      console.log('Contact Group Logged In Table :' + groupName + curDate());
      // console.log(rows);
    });
}
logContact = (uid, phone,fname,lname,table) =>{
    var sql = "INSERT INTO "+ table + " (user_id, phone, FirstName, LastName) VALUES ('"+uid+"', '"+phone+"','"+fname+"','"+lname+"')";
    mysqlConnection.query(sql, (err,rows) => {
      numRows = rows.affectedRows;
      if(err) throw err;
      console.log('Contact Logged In Table :');
      // console.log(rows);
    });
}
logQue = (groupName,message) => {
    var sql = "INSERT INTO que_msg (uid, contacts_table, message, processed, date_sent) VALUES ('1', '"+ groupName +"','"+ message +"','0','"+ curDate() +"')";
    mysqlConnection.query(sql, (err,rows) => {
      if(err) throw err;
      console.log('Contact Group Logged In Table :' + groupName + curDate());
      // console.log(rows);
    });
}

Router.post('/insertContact',(req, res)=>{

});

Router.post("/queMsg",(req, res)=>{
    tumaNow.tumatext(req.body.phone,req.body.message,"R8020","qwertyuiop");
    console.log(req.body);
   res.send('Message Qued For Sending');
});

Router.post("/bulkDlr",(req, res)=>{
    var requestID = req.body.requestId;
    var requestTimestamp = req.body.requestTimeStamp;
    var channel = req.body.channel;
    var operation  = req.body.operation;
    var traceID = req.body.traceID;
    var phone = req.body.requestParam.data[0].value;
    var cpid = req.body.requestParam.data[1].value;
    var correlatorId = req.body.requestParam.data[2].value;
    var dlrStatus = req.body.requestParam.data[3].value;
    var campaignID = req.body.requestParam.data[6].value;
    //save to db
    outgoing.logOutgoingDlr(requestID,requestTimestamp,channel,operation, traceID ,phone ,cpid, correlatorId ,dlrStatus ,campaignID);
    console.log(req.body);
    res.send({res:"dlr recieved " + correlatorId});  
 });

 Router.post("/sendSmsApi",(req, res)=>{
   
    //save to db
    // outgoing.logOutgoingDlr(requestID,requestTimestamp,channel,operation, traceID ,phone ,cpid, correlatorId ,dlrStatus ,campaignID);
    console.log(req.body);
    res.send({res:"Message Sent " + correlatorId});  
 });

Router.get("/count",(req, res)=>{
    mysqlConnection.query("SELECT COUNT(*) AS 'count' FROM messagedetails WHERE duration=0",(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
            // for (var resp of rows){
                // res.send(resp.count);
            // res.send("{count:"+resp.count+"}");
            // }

        }
        else{
            console.log('Error Fetching Data ' + err);
        }
    });
});

Router.get("/getMyGroups/:userID",(req, res)=>{
    //res.send(req.params.userID);
    mysqlConnection.query("SELECT * FROM contact_groups WHERE user_id="+req.params.userID,(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }
        else{
            console.log('Error Fetching Data ' + err);
        }
    });
});
Router.get("/outgoingBulk",(req, res)=>{
    //res.send(req.params.userID);
    mysqlConnection.query("SELECT * FROM messagedetails WHERE duration=0",(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }
        else{
            console.log('Error Fetching Data ' + err);
        }
    });
});

Router.get("/countTokens",(req, res)=>{
    mysqlConnection.query("SELECT COUNT(*) AS 'count' FROM authentication",(err,rows,fields)=>{
        if(!err){
            console.log("Sending Tokens : " + rows);
            res.send(rows);
            // for (var resp of rows){
                // res.send(resp.count);
            // res.send("{count:"+resp.count+"}");
            // }

        }
        else{
            console.log('Error Fetching Data ' + err);
        }
    });
});

Router.get("/getTokens",(req, res)=>{
    mysqlConnection.query("SELECT * FROM authentication",(err,rows,fields)=>{
        if(!err){
            //console.log("Getting You Tokens: " + rows);
            res.send(rows).json();
            // for (var resp of rows){
                // res.send(resp.count);
            // res.send("{count:"+resp.count+"}");
            // }

        }
        else{
            console.log('Error Fetching Data ' + err);
        }
    });
});

module.exports = Router;