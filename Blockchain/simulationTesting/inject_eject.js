const {stringify}  = require("json-stringify-deterministic/lib/defaults")
const mongoose = require("mongoose");
const tx = require("../wrappedFabConnect/transactions")
const get = require('../wrappedFabConnect/query')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const createUserFunction = require('../../UserRelatedFunctions/createOrRenderUser/createUser')
const createAssetFunction = require('../../AssetFunctions/createAsset')
const initalizeAsset = require('../../AssetFunctions/initializeAsset')
const query = require('../wrappedFabConnect/query')


const assets = require('../../schemas/Assets')


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





// this fucntion creates and initalizes a certain amount of assets

let order = {

}
async function inject_eject(){
    
    
    // let sampleUser = await tx("createUser",["notUsed"])
    // let deposit = await tx('deposit',["sample","notUsed","100000000000000000","true"])
    
    let inject = [{
        assetID:"fake",
        assetAmount:"1",
        usdshAmount:"10000000000",
        slippage:"10000000000000000",
        inject:"false",
        userID:"Nike",
        boost:"true",
        orderType:"InjectEject",
    }]

    tx('executeOrder',["fake",stringify(inject)])


}

//inject_eject()

// let e = "emenike"
// let b = 'arinzr'
// console.log(typeof e === 'string')

async function inject_eject_executeOrderQuerey(){
    
    
    // let sampleUser = await tx("createUser",["notUsed"])
    // let deposit = await tx('deposit',["sample","notUsed","100000000000000000","true"])
    
    let inject = [{
        asset:"fake",
        assetAmount:"1",
        usdshAmount:"10000000000",
        slippage:"10000000000000000",
        inject:"true",
        userID:"Nike",
        boost:"true",
        orderType:"InjectEject"
    }]

    //tx('executeOrder',["fake",stringify(inject)])
    query("executeOrder", ["fake",stringify(inject)]).then((data)=>{
        console.log(data.result)
    })



}


//inject_eject_executeOrderQuerey()

async function inject_eject_query(){
  let order = stringify({
    asset:"fake",
    assetAmount:"1",
    usdshAmount:"10000000000",
    slippage:"10000000000000000",
    inject:"true",
    userID:"Nike",
    boost:"true",
    orderType:"InjectEject"
    }) 


    let LP = stringify({ Asset: 10, K_Constant: 1000000000000, USDSH: 100000000000 })

    let user = stringify({ USDSH: { balance: 850000000000000000 } })

    let asset = "fake"

    let asset_LP = stringify({})  

    let assetJson = stringify({
        Bidders: { notUsed: { Bid: 10000000000000 } },
        Creator: '',
        LP: { Asset: 10, K_Constant: 1000000000000, USDSH: 100000000000 },
        amountRaised: 10000000000000,
        fees: 0,
        reserves: 10000000000
      })
    

    query("inject_eject_query", [asset,order,
        LP,asset_LP,user,assetJson]).then((data)=>{
        console.log(data.result)
    })


}


//inject_eject_query()


