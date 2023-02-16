const mongoose = require('mongoose');
let schema = mongoose.Schema;







const MessagesSchema = new schema({
    sender: String,
    recipient:String,
    body: Object,
},
{timestamps:true});


const Message = mongoose.model('Message', MessagesSchema);


module.exports = Message;


