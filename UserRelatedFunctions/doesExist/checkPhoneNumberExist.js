const mongoose = require("mongoose");
const url = "mongodb+srv://Emenike:Ninjaboy12345$@cluster0.lc7v34m.mongodb.net/?retryWrites=true&w=majority"
const user = require('../../schemas/User')


const path = require('path');
const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})

//console.log(process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error);

    })


module.exports = async function checkIfPhoneNumberExist(phoneNumber){
    const doesPhoneNumberExit = await user.exists({phoneNumber:phoneNumber})
    return doesPhoneNumberExit;
    if(doesPhoneNumberExit == null){
        return false
    }

    else{
        return true
    }

}

//checkIfPhoneNumberExist("44");