const mongoose = require("mongoose");
const url = "mongodb+srv://Emenike:Ninjaboy12345$@cluster0.lc7v34m.mongodb.net/?retryWrites=true&w=majority"
const user = require('../../schemas/User')
const checkIfEmailExist = require('../doesExist/checkEmailExist')

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

module.exports = async function changeEmail(jsonInfo){

    let {id, email} = jsonInfo
    console.log(jsonInfo)
    try{
        let check = await checkIfEmailExist(email)
        console.log("this is " + check)
        if(check){
            console.log("exist")
            return {valid:false}
        }
    
        else{
            let user2 = await user.findById(id)
            console.log(user2)

            user2.email = email;
            await user2.save();
            return {valid:true}
        }
    }

   catch(error){
       console.log(error)
       return {valid:false}
   }


}

//changeEmail({id: '63b78e1bdd67b40ce5bac98d', email: 'EmenikeCool1000000000pijnrofngorngon00000000000000000000'})

