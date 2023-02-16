const {stringify}  = require("json-stringify-deterministic/lib/defaults")
const mongoose = require("mongoose");
tx = require("../wrappedFabConnect/transactions")
get = require('../wrappedFabConnect/query')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const createUserFunction = require('../../UserRelatedFunctions/createOrRenderUser/createUser')
const createAssetFunction = require('../../AssetFunctions/createAsset')
const initalizeAsset = require('../../AssetFunctions/initializeAsset')

const path = require('path');
const { query } = require("express");
const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };


mongoose.connect(process.env.MONGODB_URL, options).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error)

    })




// this creates only one assets and has a user place bids on it
async function createAsset(name){
    //let sampleUser = await tx("createUser",["notUsed"])

    //let deposit = await tx('deposit',["sample","notUsed","100000000000000000000000000000","true"])

    const res2 = await createAssetFunction("SocialNexusSampleAsset",name)


    let sampleBid = [{
        id:"test",
        userID:"notUsed",
        assetID:name,
        usdsn:"1000",
        txID:"test"
    }]
    let res = await tx("userBid",[name,stringify(sampleBid)])
    console.log(res)
}

//createAsset("E20")




// this creates a specifided number of random assets with bids all ready placed in them
async function createAssets(amount){
    for(let i = 0; i < amount; i++){
        const userID = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
            length: 1
            }); //

        const assetID = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 1
        }); //

        const res2 = await createAssetFunction(userID,assetID)
    }
}

//createAssets(1)


async function getVal(val){
    let res = await get("get",[val])
    console.log(res)
}


//getVal("EmenikeV2")
