
const query = require('../../Blockchain/wrappedFabConnect/query');

const path = require('path');

const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})

//console.log(process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error);

    })



async function checkTxStatus(txID){
    try{
        let value = await query("Emenike", "test", "contract", "getOrder", [txID])
        console.log(value.result)
        return value.result
        
    }
    catch(error){
        console.log(error)
        return error
    }

}

checkTxStatus("NoID")


