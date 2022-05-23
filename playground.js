// // var getUser = (id,callback) =>{
// //   var user = {
// //     id:id,
// //     user:"David Kip"
// //   }
// //   return callback(user);
// // };

// // var user = getUser(31,(userObject) => {
// //   return userObject;
// // });

// // console.log(user);


const axios = require('axios');
// const { response } = require('express');
// const request = require('request');

// var b = request({url:'http://localhost:3000/outgoingBulk',json:true},(error,response,body)=>{
//   return body;
// });
// console.log(b);
// // var getOutSms = (callback) => {
// //     axios.get('http://localhost:3000/outgoingBulk').then(response =>{
// //       var obj = response.data;
// //         return callback(obj);
// //         // console.log(response.data);
// //       }).catch(err =>{
// //         console.log(err);
// //       });
// //     }
// //     var obj = getOutSms( (response) => {
// //       return JSON.stringify(response);
// //       });

// //       console.log(obj);

// // async function axiosTest(url) {
// //   const response = await axios.get(url)
// //   return response.data;
// // }

// // var d  = axiosTest('http://localhost:3000/outgoingBulk');

// // console.log(d);

// const fetch = require('node-fetch');

// var a = fetch('http://localhost:3000/outgoingBulk')
//     .then(res => res.json())
//     .then(json => {
//       return json;
//     });
//     console.log(a);

async function makeGetRequest() {

  let res = await axios.get('http://localhost:3000/outgoingBulk/count');

  let data = res.data;
  console.log(data);
}

makeGetRequest();