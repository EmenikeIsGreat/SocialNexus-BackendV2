const {stringify}  = require("json-stringify-deterministic/lib/defaults")
const mongoose = require("mongoose");
tx = require("../wrappedFabConnect/transactions")
get = require('../wrappedFabConnect/query')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const createUserFunction = require('../../UserRelatedFunctions/createOrRenderUser/createUser')
const createAssetFunction = require('../../AssetFunctions/createAsset')
const initalizeAsset = require('../../AssetFunctions/initializeAsset')
const Assets = require('../../schemas/Assets')

const path = require('path');
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



// given the name this funciton will iniitilize an asset
async function initializeAssetSingular(name){
    let res = await initalizeAsset(name)
    console.log(res)
}
    

// this initalizes all assets in the database
async function initalizeAssets(){
    let arrayOfAssets = await Assets.find();

    for(let i = 0; i < arrayOfAssets.length; i++){
        let asset = arrayOfAssets[i]
        if(asset.initialized == false){
            await initalizeAsset(asset.name)
        }
    }

}
//initalizeAssets()



    