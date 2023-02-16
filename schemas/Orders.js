const mongoose = require('mongoose');


/*
const Orders = new mongoose.Schema({
    UserID:{
        type: String,
        required: true
    },

    Transaction: {
        OrderID:{
            type: String,
            required: true
        },

        AssetID:{
            type: String,
            required: true
        },

        AssetID:{
            type: String,
            required: true
        },

        AssetAmount: {
            type: Number,
            required: true
        },

        USDSHAmount:{
            type: Number,
            required: true
        },

        OldPrice:{
            type: Number,
            required: true
        },

        NewPriceOfAsset:{
            type: Number,
            required: true
        }

    }

},
    
    { timestamps: true },
)

*/

const Orders = new mongoose.Schema({
    UserID:String,
    OrderID:String,

    Transaction: JSON
},
    
    { timestamps: true },
)

module.exports = mongoose.model('Orders', Orders)