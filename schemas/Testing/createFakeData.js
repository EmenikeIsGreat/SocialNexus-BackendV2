const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const createAsset = require('./Asset_testing')
const createUser = require('./User_testing')


const mongoose = require("mongoose");




//const transaction = require('../../Blockchain/wrappedFabConnect/transactions');
const user = require('../../schemas/User')


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

async function create(){
    for(let i = 0; i < 300; i++){
    //     const AssetName = uniqueNamesGenerator({
    //         dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    //         length: 1
    //       }); //

    //     let Asset = await createAsset.create({
    //     name:AssetName,
    //     Test:true,
    //     creator:"Sample",
    //     initialized:true,
    //     yearlyChart:Array.from({length: 40}, () => Math.floor(Math.random() * 40)),
    //     monthlyChart:Array.from({length: 40}, () => Math.floor(Math.random() * 40)),
    //     weeklyChart:Array.from({length: 40}, () => Math.floor(Math.random() * 40)),
    //     dailyChart:Array.from({length: 40}, () => Math.floor(Math.random() * 40)),
    //     minuteChart:Array.from({length: 40}, () => Math.floor(Math.random() * 40)),
    //     stats:{
    //         dailyHigh: 200,
    //         dailyLow:20,
    //         todaysVolume:1000,
    //         averageVolume:20,
    //         highestPeakWeek:200,
    //         lowestPeakWeek:300,
    //         supply:100000000,
    //         popularity:1,
    //         marketCap:10000000,
    //         deltaWeek:Math.random() < 0.5 ? -1 : 1,
    //         deltaDay:Math.random() < 0.5 ? -1 : 1,
    //         deltaMonth:Math.random() < 0.5 ? -1 : 1,
    //         deltaYear:Math.random() < 0.5 ? -1 : 1,
    //         volumeAcrossFiveDays:Array.from({length: 5}, () => Math.floor(Math.random() * 40)),
    //         withinMinuteData:Array.from({length: 40}, () => Math.floor(Math.random() * 40))
    //     }
    // })


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
        
        console.log(firstName)
        const newUser = await createUser.create({

            firstName: firstName,
            Test:true,
        
            lastName:lastName,

            email:"sample",
            
            phoneNumber:"test",

            following: 0,

            followers: 0,

            userName: userName,

            privacy: false,

            Bio:'no bio yet',

            hasProfilePic: false

        })

    }

    console.log("done")
    
}

create()