const mongoose = require('mongoose');

const Token = new mongoose.Schema({
    
    
    ID:{
        type: String,
        required: true
    },
    
    Price:{
        type: Number,
        required: true
    }

},
    
    { timestamps: true },
)
