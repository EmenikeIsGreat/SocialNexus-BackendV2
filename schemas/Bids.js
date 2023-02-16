const mongoose = require('mongoose');


/*
const Bids = new mongoose.Schema({
    User:{
        type: String,
        required: true
    },

    Transaction: {
        BidID:{
            type: String,
            required: true
        },

        AssetID:{
            type: String,
            required: true
        },

        USDSHAmount:{
            type: Number,
            required: true
        }

    }

},
    
    { timestamps: true },
)
*/


const Bids = new mongoose.Schema({
    UserID:String,
    BidID:String,

    Transaction: JSON

},
    
    { timestamps: true },
)

module.exports = mongoose.model('Bids', Bids)