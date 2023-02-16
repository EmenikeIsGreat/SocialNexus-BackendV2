const mongoose = require('mongoose');
let schema = mongoose.Schema;

const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');






const AssetList = new schema({
    name:String,
    test:String
},
{timestamps:true});


AssetList.plugin(mongoose_fuzzy_searching, { fields: ['name'] });


const Asset = mongoose.model('ListOfAssets', AssetList);


module.exports = Asset;



