const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching')
const Asset = require('../../schemas/Assets');


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

const path = require('path');

const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL, options).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error)

    })



let limit = 20
async function searchAsset(element){
 
    try {
        let response = await Asset.fuzzySearch({query:element, prefixOnly:true}).limit(limit)
        console.log(response)

        return response
    } catch (e) {
      console.error(e);
    }
}

//searchAsset("SameAsset")