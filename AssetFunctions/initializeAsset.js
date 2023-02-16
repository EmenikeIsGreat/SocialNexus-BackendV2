/// intializes asset on the blockhain. Update databse as well as notify user that their asset has been created



const mongoose = require("mongoose");
const transaction = require('../Blockchain/wrappedFabConnect/transactions')
const assetSchema = require('../schemas/Assets')
const createMessage = require('../Notification/createMessage')
const query = require('../Blockchain/wrappedFabConnect/query')

const {stringify}  = require("json-stringify-deterministic/lib/defaults")

const path = require('path');

const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})

//console.log(process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error);

    })

const delay = ms => new Promise(res => setTimeout(res, ms));
module.exports = async function initializeAsset(assetID){


    //blockchain transaction that intialize asset on the blockchain
    

    let res = await transaction("initalizeAssets", [assetID + "-Initialized",assetID])

    
    let txStatus = null

    while(txStatus == null){
        await delay(1000);
        txStatus = (await query("get",[assetID + "-Initialized"])).result.valid
        console.log(txStatus)
        
    }


    let price = await query("getPrice",[stringify([assetID]),"false"])
    let asset = await assetSchema.findOne({name:assetID})
        
    price = price.result[0].price

    asset.initialized = true
    asset.stats.withinMinuteData = price

    await asset.save()

}

//initializeAsset("EmenikeV2")


const yourFunction = async () => {
    let result = await query("get",["assetID + -Initialized"])
    console.log(result.result.value)
  };

//yourFunction()