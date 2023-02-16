const {stringify}  = require("json-stringify-deterministic/lib/defaults")
const mongoose = require("mongoose");
tx = require("../wrappedFabConnect/transactions")
get = require('../wrappedFabConnect/query')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const createUserFunction = require('../../UserRelatedFunctions/createOrRenderUser/createUser')
const createAssetFunction = require('../../AssetFunctions/createAsset')
const initalizeAsset = require('../../AssetFunctions/initializeAsset')


const assets = require('../../schemas/Assets')






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







// this fucntion creates and initalizes a certain amount of assets
async function createAndInitalizeAssets(amount){

    let sampleUser = await tx("createUser",["notUsed"])
    for(let i = 0; i < amount; i++){
        

        let deposit = await tx('deposit',["sample","notUsed","100000000000000000000000000000","true"])
        const userID = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
            length: 1
            }); //

        const assetID = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 1
        }); //
        
        console.log(userID,assetID)
        console.log("---------")
        const res2 = await createAssetFunction(userID,assetID)
        let sampleBid = [{
            id:"test",
            userID:"notUsed",
            assetID:assetID,
            usdsn:"1000",
            txID:"test"
        }]

        console.log("here")
        let res = await tx("userBid",[assetID,stringify(sampleBid)])
        await initalizeAsset(assetID)
        
        
    }
}


createAndInitalizeAssets(10)


async function createAndInitalizeAsset(name){
    let sampleUser = await tx("createUser",["notUsed"])

    let deposit = await tx('deposit',["sample","notUsed","100000000000000000000000000000","true"])
    const res2 = await createAssetFunction("",name)
    let sampleBid = [{
        id:"test",
        userID:"notUsed",
        assetID:name,
        usdsn:"10000000000000",
        txID:"test"
    }]
    let res = await tx("userBid",[name,stringify(sampleBid)])
    await initalizeAsset(name)

}

//createAndInitalizeAsset("fake")


async function getVal(val){
    let res = await get("get",[val])
    console.log(res)
}

//getVal("notUsed")


async function checkBalance(asset){
    let res = await get("checkAssetBalance",["notUsed",asset,"100000"])
    console.log(res)
}

async function populateAssetChartWithFakeData(){

    let count = 0
    for await (const doc of assets.find()) {
        
        doc.dailyChart = Array.from({length: 40}, () => Math.floor(Math.random() * 100));
        doc.monthlyChart = Array.from({length: 40}, () => Math.floor(Math.random() * 100));
        doc.yearlyChart = Array.from({length: 40}, () => Math.floor(Math.random() * 100));
        doc.weeklyChart = Array.from({length: 40}, () => Math.floor(Math.random() * 100));
        doc.minuteChart = Array.from({length: 40}, () => Math.floor(Math.random() * 100));
        doc.stats.withinMinuteData = Array.from({length: 40}, () => Math.floor(Math.random() * 100));
        await doc.save();
        console.log(count)
        count += 1

        }

    }
//populateAssetChartWithFakeData()

//checkBalance("fake")

//getVal("fake")