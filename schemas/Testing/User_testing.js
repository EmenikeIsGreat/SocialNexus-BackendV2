const mongoose = require('mongoose');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const User = new mongoose.Schema({
    Test:Boolean,
    UserID:{
        type:String,
    },

    userName:{
        type: String,
        requried: true
    },
    
    firstName:{
        type: String,
        requried: true
    },

    lastName:{
        type: String,
        requried: true
    },

    userName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    phoneNumber:{
        type:String,
        required: true
    },

    hasProfilePhoto: Boolean,

    following: Number,

    followers: Number,

    privacy:Boolean,

    Bio:String,

    hasProfilePic: Boolean

    },

    { timestamps: true },
)


User.plugin(mongoose_fuzzy_searching, { fields: ["firstName","lastName","userName"] });

module.exports = mongoose.model('UserTesting', User)



