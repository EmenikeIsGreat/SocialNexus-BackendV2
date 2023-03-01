const axios = require('axios') 
const stringify  = require('json-stringify-deterministic');
const path = require('path');



const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})

let baseURL = process.env.KALEIDO_PEER_BASE_URL
let HLF_Signer = process.env.HLF_SIGNER
let flyChannel = process.env.HLF_FLY_CHANNEL
let auth = process.env.AUTHORIZATION
let contract = process.env.HLF_CONTRACT

/*
sample curl reequest
curl -X 'POST' \
  'https://u0gqwel2qs-u0f6ogmk5v-connect.us0-aws-ws.kaleido.io/transactions' \
  -H 'accept:
  -H 'Content-Type: application/json' 
  -H 'Authorization: Basic dTBmbmVuNDB5azpMbVFMMjE1MkpRLWxhMDVUb3JOenlteGFvaFpjdUtHdnRJSUEza2dQeGJR' \
  -d '{
  "headers": {
    "type": "SendTransaction",
    "signer": "Emenike",
    "channel": "test",
    "chaincode": "contract"
  },
  "func": "createUser",
  "args": [
    "Emenike"
  ],
  "init": false
}'
*/


module.exports = async function transaction(func, args){
    let url = baseURL + 'transactions?fly-sync=' + true
    try{
        
        const res = await axios.post(url,
            {
                "headers": {
                    "type": "SendTransaction",
                    "signer": HLF_Signer,
                    "channel": flyChannel,
                    "chaincode": contract
                },
                "func": func,
                "args":args,
                "init": false
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
        return res.data
    }
    catch(error){
        //console.log("failed")
        //console.log(error.response.data)
        return error.response.data
    }
}


let testOrder = stringify([
  {
    id:"12345",
    userID: "Emenike2",
    assetID: "testCoin",
    orderType: "Buy",
    tokenAmount: 1,
    strikePrice: 90,
    slippage: 300000000
  }
])


let testOrder4 = stringify([
  {
    id:"12345",
    userID: "Emenike2",
    assetID: "testCoin",
    usdsn: 3000
  }
])



// let id = orders[i].id
// let userID = orders[i].userID;
// let assetID = orders[i].assetID
// let usdsn = orders[i].usdsn
// let txID = orders[i].txID





/*

when invoking a function that requires json data you should stringify it first and send it 

*/



// transaction('createUser',["SocialNexusExternalTxFees"])
// transaction('createUser',["SocialNexus"])
//transaction('createUser',["Emenike"])

// for(i = 0; i < 10; i++){
//   transaction('withdraw',["sample","63b79170871e180d114f80c9","100",'true'])
// }


//transaction('createUser',["63b79170871e180d114f80c9"])
//transaction('deposit',["EmenikeTXFROMID","Emenike","1000000","true"])
//transaction('withdraw',["EmenikeTXFROMID","Emenike23","105000",'true'])



//console.log(JSON.parse(SampleDepositWithdrawOrder)[0])

//transaction('initialize',["0","0","0"])



//transaction('createAsset',["Emenike","SocialNexusV2"])
//transaction('userBid',["EmenikeAsset",sampleOrderBid])
//transaction('initalizeAssets',["EmenikeAsset"])

//transaction('deposit',["Emenike","10000000","true"])