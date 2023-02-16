const mongoose = require('mongoose');

const ExternalTx = new mongoose.Schema({
    UserID:{
        type: String,
        required: true
    },

    Transaction: JSON 

},
    
    { timestamps: true },
)

module.exports = mongoose.model('ExternalTx', ExternalTx)