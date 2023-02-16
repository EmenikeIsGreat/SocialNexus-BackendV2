const url = "mongodb+srv://Emenike:Ninjaboy12345$@cluster0.lc7v34m.mongodb.net/?retryWrites=true&w=majority"
const user = require('../../schemas/User')
const checkIfPhoneNumberExist = require('../doesExist/checkPhoneNumberExist')
const mongoose = require("mongoose");


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

module.exports = async function changePhoneNumber(jsonInfo){
    
    let {id, phoneNumber} = jsonInfo
    console.log("prinitng jsonInfo")
    console.log(jsonInfo);

    try{

        let check = await checkIfPhoneNumberExist(phoneNumber)
        
        if(check){
            console.log("exist")
            return {valid:false}
        }


        let user2 = await user.findById(id)

        user2.phoneNumber = phoneNumber;
        
        let response = await user2.save();
        console.log(response)
        return {phoneNumber: phoneNumber, valid:true}

    }

   catch(error){
       console.log(error)
       return error
   }


}

//changePhoneNumber({id:'62c0eadc47ec21fd9e585023', phoneNumber:3})

