const axios = require('axios') 
const path = require('path');


const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})




/*
sample curl reequest
curl -X 'POST' \
  'https://u0gqwel2qs-u0f6ogmk5v-connect.us0-aws-ws.kaleido.io/eventstreams' \
  -H 'accept: ' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic dTBmbmVuNDB5azpMbVFMMjE1MkpRLWxhMDVUb3JOenlteGFvaFpjdUtHdnRJSUEza2dQeGJR' \
  -d '{
  "name": "string",
  "type": "webhook",
  "webhook": {
    "url": "https://webhook.site/b47a3e71-0b82-4123-9ebe-c041444e8831",
    "tlsSkipHostVerify": true
  }
}'
*/


async function createEventStream(eventStreamName, webHookUrl,testing){
    let baseURL = testing ? process.env.KALEIDO_PEER_BASE_URL_Testing:process.env.KALEIDO_PEER_BASE_URL
    let HLF_Signer = testing ? process.env.HLF_SIGNER_Testing:process.env.HLF_SIGNER
    let flyChannel = testing ? process.env.HLF_FLY_CHANNEL_Testing:process.env.HLF_FLY_CHANNEL
    let auth = testing ? process.env.AUTHORIZATION_Testing:process.env.AUTHORIZATION
    try{
        
        const res = await axios.post(baseURL + 'eventstreams',
            {
                "name": eventStreamName,
                "type": "webhook",
                "webhook": {
                    "url":webHookUrl,
                    "tlsSkipHostVerify":true
                }
              },
              
            {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
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

createEventStream("Samar", "http://3.86.52.85:8080/processOrder/HandleEvent")
