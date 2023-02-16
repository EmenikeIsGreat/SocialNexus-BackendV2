const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching')
const User_Sample = require('../schemas/Testing/User_testing');
const Asset_Sample = require('../schemas/Testing/Asset_testing');
const User = require('../schemas/User');
const Asset = require('../schemas/Assets')
const search2 = require('../schemas/Assets')
const checkMutual = require('../UserRelatedFunctions/doesExist/isMutual')




const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

const path = require('path');
const { stringify } = require("querystring");

const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL, options).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error)

    })



function compare( a, b ) {

    if (a._doc.confidenceScore > b._doc.confidenceScore){
        return -1;
    }
    if ( a._doc.confidenceScore < b._doc.confidenceScore){
        return 1;
    }
    return 0;
}
    


let limit = 10
module.exports = async function search(id,element){
    let res = []
    try {
        let response1 = await User.fuzzySearch({query:element, prefixOnly:true}).limit(limit).lean().select("-lastName_fuzzy -firstName_fuzzy -userName_fuzzy")

        for(let i = 0; i < response1.length; i++){
            response1[i].mutual = await checkMutual(id,response1[0]._id)
        }

        let response2 = await Asset.fuzzySearch({query:element, prefixOnly:true}).limit(limit).lean().select("-name_fuzzy")
        
        let resJson = {
            Assets:response2,
            Users:response1
        }

        console.log(resJson)
        return resJson



    } catch (e) {
      console.error(e);
      return e
    }
}


//search("lon")