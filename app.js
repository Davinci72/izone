
const express = require('express');
const bodyParser = require('body-parser');
const outgoing = require('./outgoingBulkQue');
const tokens = require('./refereshToken');
const ignite   = require('./outgoingBulk');
const outgoingBulkRoutes = require('./routes/outgoingBulkSms.js');
var app = express();

app.use(bodyParser.json());
//get outgoing bulk que
app.use("/outgoingBulk", outgoingBulkRoutes);
app.listen(9000);



// function logEvery2Seconds(i) {
//   setTimeout(() => {
//       outgoing.logOutgoing('COSMERE','254725597552','TEST MESSAGE');
//       console.log('Infinite Loop Test n:', i);
//       logEvery2Seconds(++i);
//   }, 0)
// }

// logEvery2Seconds(0);
// tokens.getCountTokens();
// ignite.tumatext("254720851434","test Message 2","SDPTest","002");


// let i = 0;
setInterval(() => {
    tokens.getCountTokens();
    ignite.ignite();
    // outgoing.queMsg();
    console.log('Application Running.... :');
}, 10000);
