const axios = require('axios') 
const stringify  = require('json-stringify-deterministic');
const path = require('path');


const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})




/*
sample curl reequest
curl -X 'POST' \
  'https://u0gqwel2qs-u0f6ogmk5v-connect.us0-aws-ws.kaleido.io/query' \
  -H 'accept: 
  -H 'Content-Type: application/json' 
  -H 'Authorization: Basic dTBmbmVuNDB5azpMbVFMMjE1MkpRLWxhMDVUb3JOenlteGFvaFpjdUtHdnRJSUEza2dQeGJR' \
  -d '{
  "headers": {
    "signer": "Emenike",
    "channel": "test",
    "chaincode": "contract"
  },
  "func": "getUser",
  "args": [
    "Emenike"
  ],
  "strongread": true
}'
*/
module.exports = async function query(func, args,testing){

  let baseURL = testing ? process.env.KALEIDO_PEER_BASE_URL_Testing:process.env.KALEIDO_PEER_BASE_URL_Testing
  let HLF_Signer = testing ? process.env.HLF_SIGNER_Testing:process.env.HLF_SIGNER
  let flyChannel = testing ? process.env.HLF_FLY_CHANNEL_Testing:process.env.HLF_FLY_CHANNEL
  let auth = testing ? process.env.AUTHORIZATION_Testing:process.env.AUTHORIZATION
  let contract = testing ? process.env.HLF_CONTRACT:process.env.HLF_CONTRACT

    try{
        
        const res = await axios.post(baseURL + 'query',
            {
                "headers": {
                  "signer": HLF_Signer,
                  "channel": flyChannel,
                  "chaincode": contract
                },
                "func": func,
                "args":args,
                "strongread": true
              },{
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + auth
              }   
        }
        );
        //console.log("success")
        //console.log(res.data)
        //console.log(res.data)
        return res.data
    }
    catch(error){
        //console.log("failed")
        //console.log(error.response.data)
        return error.response.data
    }
}





// arr = JSON.parse(arr).assets
// for(let i = 0; i < arr.length; i++){
//   console.log(arr[i])
// }


// query( "get", ["Emenicjefjvkefvke23"]).then((data)=>{
//   console.log(data)
// })
//query("Emenike", "test", "contract", "getUser", ["testCoin"])



// query("hasBalance",["notUsed","10"]).then((data)=>{
//   console.log(data.result)
// })



// query("getAsset", ["NZ"]).then((data)=>{
//   console.log(data.result)
// })



// query("getPrice_Test", [arr3]).then((data)=>{

//   let Obj = new Map()
//   console.log(data.result._data)

//   for(let i = 0; i < data.result._data.length; i++){
//       let jsonFirstElement = Object.keys(data.result._data[i])[0]
//       Obj.set(Object.keys(jsonFirstElement), data.result._data.length[i][jsonFirstElement]) 
//       console.log("Emenike")
//     }
//   //console.log(Obj)
// })



// console.log(JSON.parse(arr3).assets)

// let asset = {
//   Bidders: { 
//     Emenike23: { Bid: 20 },
//     Emenike24: { Bid: 21 },
//     Emenike25: { Bid: 22 },
//     Emenike26: { Bid: 23 }   
//   }
// }

// for (const key in asset.Bidders){
//   console.log(key)  
// }

// query("getAsset", ["Ravetron"]).then((data)=>{
//   console.log(data.result)
// })

// query("getUser", ["Samar"]).then((data)=>{
//   console.log(data.result)
// })


// query( "get", ["test"]).then((data)=>{
//   console.log(data.results)
// })

// query("getTotalFees", []).then((data)=>{
//   console.log(data)
// })

// query("test_LP_Math", ["Ravetron","9.8","Buy","false"]).then((data)=>{
//   console.log(data.result)
// })


