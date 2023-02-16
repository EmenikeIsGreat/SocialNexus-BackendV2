const mongoose = require('mongoose');

const RT = new mongoose.Schema({
    userID:{
        type: String,
        required: true
    },

    RefresherToken: {
        type: String,
        required: true
    }

},
    
    { timestamps: true },
)

module.exports = mongoose.model('JWT-RT', RT)