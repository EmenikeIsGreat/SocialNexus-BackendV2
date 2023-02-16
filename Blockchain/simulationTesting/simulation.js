const {stringify}  = require("json-stringify-deterministic/lib/defaults")
const mongoose = require("mongoose");
const tx = require("../wrappedFabConnect/transactions")
const get = require('../wrappedFabConnect/query')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const createUserFunction = require('../../UserRelatedFunctions/createOrRenderUser/createUser')
const createAssetFunction = require('../../AssetFunctions/createAsset')
const initalizeAsset = require('../../AssetFunctions/initializeAsset')


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


//creates only one user on the blockchain and not on the database
async function createOneUser(name){
    const res = await tx("createUser",[name])
    console.log(res)
}

//createOneUser("Emenike")

// create users on the blcockhain and on the database
async function createUsers(amount){
    for(let i = 0; i < amount; i++){
        const firstName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
            length: 1
          }); //

        const lastName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 1
        }); //

        const userName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
            length: 1
          }); //

        const email = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 1
        }); //


        const password = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 1
            }); //


        let userCreate = {
            firstName:firstName,
            lastName:lastName,
            userName:userName,     
            phoneNumber:Math.floor(Math.random()*10000000000),
            email:email,
            password:password
        }

        let temp = await createUserFunction(userCreate)
        //console.log(temp)
    
    }

}


createUsers(10)
  

// create one asset
async function createAsset(name){
    let sampleUser = await tx("createUser",["notUsed"])

    let deposit = await tx('deposit',["sample","notUsed","100000000000000000000000000000","true"])

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


//createAsset("EmenikeAsset21") 


// create multiplte assets

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



async function initializeAsset(name){
    let res = await initalizeAsset(name)
    console.log(res)
}


// async function userBid(name,amount){

//     let sampleBid = [{
//         id:"test",
//         userID:"Samar",
//         assetID:"SumSum",
//         usdsn:"1000000",
//         txID:"test"
//       }]
      
      
//     transaction('userBid',["Izzy",stringify(sampleBid)])
//     let bid = await userBid()
// }


async function crrateAssetAndInitalizeAsset(name){
    let sampleUser = await tx("createUser","notUsed")
    let deposit = await tx('deposit',["sample","Emenike","100000000000000000000000000000","true"])
    
    let dummyUser = await tx("createUser","dummyUser")

    const res2 = await createAssetFunction("SocialNexusSampleAsset",userID)

}

async function createAssetAndInitialize(amount){

    let sampleUser = await tx("createUser","notUsed")
    let deposit = await tx('deposit',["sample","Emenike","100000000000000000000000000000","true"])

    const userID = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        length: 1
      }); //

    const assetID = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    length: 1
    }); //

    const res1 = await tx("createAsset",["SocialNexusSampleAsset",assetID])
    const initializeAsset = await tx("initalizeAssets", [assetID])
    const res2 = await createAssetFunction("SocialNexusSampleAsset",userID)

      
      
//     transaction('userBid',["Izzy",stringify(sampleBid)])
//     let bid = await userBid()
    for(let i = 0; i < amount; i++){
        const name = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
            length: 1
          });
        
        let sampleBid = [{
            id:name,
            userID:"Samar",
            assetID:"SumSum",
            usdsn:"1000000",
            txID:"test"
        }]
        let res = await tx("userBid",[name,stringify(sampleBid)])
        

    }

}


/*
create asset on the blockchain and the database

initalize asset on the blockchain and n database

create users

allow for deposits

allow for withdraws

allow for buy

allow for sell

allow for bid

allow for blockchain conversion for asset



*/


