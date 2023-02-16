const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching')
const User_Sample = require('../schemas/Testing/User_testing');
const Asset_Sample = require('../schemas/Testing/Asset_testing');
const User = require('../schemas/User');
const Asset = require('../schemas/Assets')
const checkMutual = require('../UserRelatedFunctions/doesExist/isMutual')
const search = require('../schemas/search')




const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

const path = require('path');

const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL, options).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error)

    })


let limit = 10
async function fuzzySearch(id, element){
    console.log(id,element)
    try {
        let response = await search.fuzzySearch({query:element, prefixOnly:true}).limit(limit)
        console.log(response)
        console.log('------')
        return response

    } catch (e) {
      console.error(e);
      return e
    }
}


fuzzySearch(2, "lon")