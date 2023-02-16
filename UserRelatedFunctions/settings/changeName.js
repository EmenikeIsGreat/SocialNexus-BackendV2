const mongoose = require("mongoose");
const url = "mongodb+srv://Emenike:Ninjaboy12345$@cluster0.lc7v34m.mongodb.net/?retryWrites=true&w=majority"
const user = require('../../schemas/User')



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

module.exports = async function changeName(jsonInfo){
    
    let {id, firstName, lastName} = jsonInfo

    try{

        let user2 = await user.findById(id)

        user2.firstName = firstName;
        user2.lastName = lastName;
        
        let response = await user2.save();
        console.log(response)
        jsonInfo.valid = true;
        return jsonInfo

    }

   catch(error){
       console.log(error)
       return error
   }


}

//changeName('62c0eadc47ec21fd9e585023', {firstName:"ArinzeTheCoolOne",lastName:"OK"})

