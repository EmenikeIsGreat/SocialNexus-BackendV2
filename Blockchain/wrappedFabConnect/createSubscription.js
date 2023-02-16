const axios = require('axios') 
const path = require('path');


const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})

let baseURL = process.env.KALEIDO_PEER_BASE_URL
let HLF_Signer = process.env.HLF_SIGNER
let flyChannel = process.env.HLF_FLY_CHANNEL
let auth = process.env.AUTHORIZATION


/*
sample curl reequest
curl -X 'POST' \
  'https://u0gqwel2qs-u0f6ogmk5v-connect.us0-aws-ws.kaleido.io/subscriptions' \
  -H 'accept:' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic dTBmbmVuNDB5azpMbVFMMjE1MkpRLWxhMDVUb3JOenlteGFvaFpjdUtHdnRJSUEza2dQeGJR' \
  -d '{
  "name": "sub1",
  "stream": "es-aeebdc04-3b27-45bc-784c-02ed4f4c3c71",
  "channel": "test",
  "signer": "contract",
  "fromBlock": "0",
  "payloadType": "json",
  "filter": {
    "blockType": "tx"
  }
}'
*/


async function createSubscription(name, stream, startingBlock){
    try{
        let url = baseURL + 'subscriptions'
        const res = await axios.post(url,
            {
                "name": name,
                "stream": stream,
                "channel": flyChannel,
                "signer": HLF_Signer,
                "fromBlock": startingBlock,
                "payloadType": "json",
                "filter": {
                  "blockType": "tx"
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

createSubscription("SocialNexusEvents", "es-7789fd98-b327-4b30-6d48-be1349ff96e4", "190")
