const mongoose = require('mongoose');

const FollowerFollowing = new mongoose.Schema({
    
    
    userID:{
        type: String,
        required: true
    },
    
    followerID:{
        type: String,
        required: true
    }

},
    
    { timestamps: true },
)


const FollowerFollowingStatus = mongoose.model('FollowerFollowing', FollowerFollowing);


module.exports = FollowerFollowingStatus;
