const mongoose = require('mongoose');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');



const search = new mongoose.Schema({
        userName:String,
        assetName:String,
        firstName:String,
        lastName:String,
        creatorName:String,
        type:String,
        totalHits:Number,
        totalHitsAcrossFiveDays:Number

    },
    
    { timestamps: true },
)

search.plugin(mongoose_fuzzy_searching, { fields: ['userName,assetName,firstName,lastName,creatorName'] });


module.exports = mongoose.model('Search', search)

