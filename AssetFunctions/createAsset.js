// this creates an asset on the database and on the blockchain as well as
// notify user that their asset has been created



const mongoose = require("mongoose");
const transaction = require('../Blockchain/wrappedFabConnect/transactions')
const assets = require('../schemas/Assets')
const createMessage = require('../Notification/createMessage')
const search = require('../schemas/search')

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

module.exports = async function createAsset(userID,name,creatorName){

    try{

        //checks if the asset exist in the database

        let doesExist = await assets.exists({"name": name})
        // if(doesExist){
        //     return {
        //         exist:true
        //     }
        // }

        // create asset on databse
        let addAsset = await assets.create({
            name:name,
            creator:userID,
            hasPic:false,
            initialized:false,
            yearlyChart:[0],
            monthlyChart:[0],
            weeklyChart:[0],
            dailyChart:[0],
            minuteChart:[0],
            stats:{
                dailyHigh: 0,
                dailyLow:0,
                todaysVolume:0,
                averageVolume:0,
                highestPeakWeek:0,
                lowestPeakWeek:0,
                supply:0,
                popularity:0,
                marketCap:0,
                deltaWeek:0,
                deltaDay:0,
                deltaMonth:0,
                deltaYear:0,
                volumeAcrossFiveDays:[0],
                withinMinuteData:[0]
            }
        })
        await search.create({
            userName:"",
            assetName:name,
            firstName:"",
            lastName:"",
            creatorName:"",
            type:"user",
            totalHits:0,
            totalHitsAcrossFiveDays:0
    
        })

        // notify user that their asset has been created
        //await createMessage("SocialNexus",userID,"Your Asset has been Created")
        
        // create asset on the blockchain
        let response = await transaction('createAsset',[name,userID])
        return response
        
    }

    catch(error){
        console.log(error)
    }

}

// switch the inputs
// createAsset('Arinze',"NZ")
// createAsset('Rav',"Ravetron")
// createAsset('Izunna',"Izzy")
//createAsset('Adanna',"Adaze")
// createAsset('Samar',"SumSum")




//populateAssetChartWithFakeData()





