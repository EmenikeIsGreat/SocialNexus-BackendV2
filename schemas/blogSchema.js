const mongoose = require('mongoose');

const blog = new mongoose.Schema({
    
    
    title:{
        type: String,
        required: true
    },
    
    body:{
        type: String,
        required: true
    }

},
    
    { timestamps: true },
)

module.exports = mongoose.model('blog', blog)