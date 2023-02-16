const mongoose = require("mongoose");
const url = "mongodb+srv://Emenike:Ninjaboy12345$@cluster0.lc7v34m.mongodb.net/?retryWrites=true&w=majority"
const user = require('../../schemas/User')
const checkUserNameExist = require('../doesExist/checkUserNameExist')

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
module.exports = async function changeUserName(jsonInfo){

    let {id, userName} = jsonInfo


    try{
        let check = await checkUserNameExist(userName)
        
        if(check){
            console.log("exist")
            return {valid:false}
        }
    
        else{
            let user2 = await user.findById(id)
            console.log(user2)

            user2.userName = userName;
            await user2.save();
            return {userName: userName,  valid:true, }
        }
    }

   catch(error){
       console.log(error)
       return error
   }


}

//changeUserName({userID:'62c0eadc47ec21fd9e585023', userName: 'EmenikeCool1000000000000'})

