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
module.exports = async function changeBio(jsonInfo){
    
    let {id, newBio} = jsonInfo

    console.log(jsonInfo)

    try{

        let user2 = await user.findById(id)
        console.log(user2)

        user2.Bio = newBio

        
        let response = await user2.save();
        

        return {valid:true}

    }

   catch(error){
       console.log(error)
       return {valid:false}
   }


}

//changeBio({id: '63b79170871e180d114f80c9', newBio:"Test Bio"})

