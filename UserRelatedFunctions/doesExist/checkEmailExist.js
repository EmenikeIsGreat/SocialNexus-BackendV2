const mongoose = require("mongoose");
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




module.exports = async function checkIfEmailExist(email){

    const doesEmailExit = await user.exists({email:email})
    console.log("does this exist " + doesEmailExit);
    return doesEmailExit;
    console.log("does this exist " + doesEmailExit);
    if(doesEmailExit == true){
        return false
    }

    else{
        return true
    }

}

//checkIfEmailExist("98549835u9437")