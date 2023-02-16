const mongoose = require('mongoose');

const Passwords = new mongoose.Schema({
    
    
    user:{
        type: String,
        required: true
    },
    
    encryptedPassword:{
        type: String,
        required: true
    }

},
    
    { timestamps: true },
)
module.exports = mongoose.model('Passwords', Passwords)