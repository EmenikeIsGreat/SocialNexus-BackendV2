
const axios = require('axios') 
const path = require('path');


const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})

let baseURL = process.env.KALEIDO_PEER_BASE_URL
let HLF_Signer = process.env.HLF_SIGNER
let flyChannel = process.env.HLF_FLY_CHANNEL
let auth = process.env.AUTHORIZATION


console.log(baseURL);
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


async function deleteSubscription(subID){
    try{
        let url = baseURL + 'subscriptions/'+subID
        const res = await axios.delete(url,
            {
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

deleteSubscription("sb-4139dfc1-b19b-4c4a-6ebc-1cb4242f01f7")