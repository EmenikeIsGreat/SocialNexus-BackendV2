const mongoose = require('mongoose');



const Transaction = new mongoose.Schema({
    UserID:String,
    TxID:String,
    External:Boolean,
    Type:String,
    Transaction: JSON
},
    
    { timestamps: true },
)

module.exports = mongoose.model('Transaction', Transaction)