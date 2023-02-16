const mongoose = require("mongoose");
const message = require('../../Notification/createMessage')
const user = require('../../schemas/User')
const followingUnfollowing = require('../../schemas/followerFollowing')



const path = require('path');

const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})

//console.log(process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error);

    })

module.exports = async function followUnfollow(status,fromID,toID){
    console.log(status,fromID,toID)
 
    let checkIfExist = await followingUnfollowing.exists({userID:fromID,followerID:toID})


    let fromFollower = await user.findById(fromID)
    let follower = await user.findById(toID)
    
    if(status == 'follow'){

        if(checkIfExist){
            //console.log("all ready exist")
            return {success: false}
        }

        
        fromFollower.following += 1
        follower.followers += 1

        let response = await followingUnfollowing.create({
            userID:fromID,
            followerID:toID
        })

        let messageResponse = await message("SocialNexus",toID,"New Follower")

    }

    else{

        fromFollower.following -= 1
        follower.followers -= 1

        let response = await followingUnfollowing.findOneAndDelete({userID: fromID, followerID:toID})

        console.log({response: response})
    }

    let response1 = await fromFollower.save()
    let response2 = await follower.save()

    // console.log(response1)
    // console.log('--------------')
    // console.log(response2)
    console.log("executed followUnfollow")
    return {success: true}
    
}

//followUnfollow({status: 'follow',fromID: '63dad0f0c935f165304f57f5', toID:'63dad0f1c935f165304f57f6'})




// this is for testing
async function createUsers(){
    let newUser1 = await user.create({

        firstName: "Emenike",
    
        lastName:"Anigbogu",

        email:"emenikeani",
        
        phoneNumber:"61728696544444",

        following: 0,

        followers: 0,

        userName: "Emen",

        privacy: false,

        Bio:'no bio yet',

        hasProfilePic: false

    })

    let newUser2 = await user.create({

        firstName: "Arinze",
    
        lastName:"Anigbogu",

        email:"emenikeani",
        
        phoneNumber:"61728696544444",

        following: 0,

        followers: 0,

        userName: "Arin",

        privacy: fnealse,

        Bio:'no bio yet',

        hasProfilePic: false

    })

    console.log(newUser1)
    console.log(newUser2)

}
//createUsers();

async function getUser(id){
    let user1 = await user.findById(id)
    console.log(user1)
}
//getUser("63dad0f0c935f165304f57f5")
//getUser("63dad0f1c935f165304f57f6")

