// returns asset json from database

const mongoose = require("mongoose");
const assets = require('../schemas/Assets')


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


// when server request asset then simply call it from the database and send return the asset from the database
module.exports = async function getAsset(name){

    try{
        let asset = await assets.findOne({"name":name})
        //console.log(asset)
        return asset
    }

   catch(error){
        console.log(error)
       return error
       
   }


}

//getAsset("30")

