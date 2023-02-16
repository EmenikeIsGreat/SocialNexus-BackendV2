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

module.exports = async function checkMutual(fromID,toID){



    let isFollowing = await followingUnfollowing.exists({userID:fromID,followerID:toID})
    let isFollower = await followingUnfollowing.exists({userID:toID,followerID:fromID})

    let res = {
        following:isFollowing,
        follower:isFollower
    }

    return res
    
}




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




function doSom(){
    
    let json = {
        x:4
    }

    doSom2(json)
    console.log(json)
}

function doSom2(input){
    input.x += 1
}

//doSom()

let json = {
    value:4
}

console.log(json["value1"])
