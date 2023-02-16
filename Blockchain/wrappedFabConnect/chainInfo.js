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
curl -X 'GET' \
  'https://u0gqwel2qs-u0f6ogmk5v-connect.us0-aws-ws.kaleido.io/chaininfo?fly-channel=test&fly-signer=Emenike' \
  -H 'accept: application/json' \
  -H 'Authorization: Basic dTBmbmVuNDB5azpMbVFMMjE1MkpRLWxhMDVUb3JOenlteGFvaFpjdUtHdnRJSUEza2dQeGJR'
*/


module.exports = async function chainInfo(dataAmount){
    let url = baseURL + 'chaininfo?fly-channel=' + flyChannel + '&fly-signer=' + HLF_Signer
    //https://u0vs2fxu5n-u0kxbxafrm-peer.us0-aws-ws.kaleido.io/
    //https://u0vs2fxu5n-u0kxbxafrm-connect.us0-aws-ws.kaleido.io/chaininfo?fly-channel=test&fly-signer=Emenike

    try{
        
        const res = await axios.get(url,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + auth
              }   
        }
        );

        //console.log("success")
        //console.log(res.data.result)
        if(dataAmount == "all"){
            return res.data.result
        }
        else{
            return res.data.result.height
        }
    }
    catch(error){
        console.log("failed")
        console.log(error)
        return error
    }
}

//chainInfo("all")

//module.exports = chainInfo()


