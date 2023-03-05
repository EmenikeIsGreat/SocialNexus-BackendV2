const axios = require('axios') 
const path = require('path');


const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})

// let baseURL = process.env.KALEIDO_PEER_BASE_URL
// let HLF_Signer = process.env.HLF_SIGNER
// let flyChannel = process.env.HLF_FLY_CHANNEL
// let auth = process.env.AUTHORIZATION










/*
sample curl reequest
curl -X 'GET' \
  'https://u0gqwel2qs-u0f6ogmk5v-connect.us0-aws-ws.kaleido.io/subscriptions' \
  -H 'accept: ' \
  -H 'Authorization: Basic dTBmbmVuNDB5azpMbVFMMjE1MkpRLWxhMDVUb3JOenlteGFvaFpjdUtHdnRJSUEza2dQeGJR'
Request URL
*/


async function getSubscription(stream){
    let baseURL = testing ? process.env.KALEIDO_PEER_BASE_URL_Testing:process.env.KALEIDO_PEER_BASE_URL
    let HLF_Signer = testing ? process.env.HLF_SIGNER_Testing:process.env.HLF_SIGNER
    let flyChannel = testing ? process.env.HLF_FLY_CHANNEL_Testing:process.env.HLF_FLY_CHANNEL
    let auth = testing ? process.env.AUTHORIZATION_Testing:process.env.AUTHORIZATION
    
    let url;
    if(stream == "all"){
        url = baseURL + 'subscriptions'
    }
    else{
        url = baseURL + 'subscriptions' + stream
    }

    try{
        
        const res = await axios.get(url,{
            headers: {
                'accept': '*/*',
                'Authorization': 'Basic ' + auth
              }   
        }
        );
        console.log("success")
        console.log(res.data)
        return res.data
    }
    catch(error){
        console.log("failed")
        console.log(error.response.data)
        return error
    }
}

getSubscription("all")
