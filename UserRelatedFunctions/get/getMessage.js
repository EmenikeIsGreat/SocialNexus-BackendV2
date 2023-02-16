const mongoose = require("mongoose");
const message = require('../../schemas/Message')


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

// retrieves users messages
module.exports = async function getMessage(jsonInfo){

    let {id, amount, initialRender, date} = jsonInfo

    amount = parseInt(amount)
    let doesUserExist = await message.exists({'recipient':id});
    //console.log(doesUserExist);
    if(!doesUserExist){
        console.log("THE USER IS NOT FOUND. CANNOT GET TRANSACTIONS")
        return [];
    }

    try{
        if(initialRender){
            console.log("hello Emenike")
            let renderMessages = await message.find({'recipient':id}).sort({$natural:-1}).limit(amount)

            let max = false
            if(renderMessages.length < amount){
                max = true
            }

            let output = {
                messages: renderMessages,
                lastDate: renderMessages[renderMessages.length-1].createdAt,
                max:max
            }
            console.log(output)
            return output
        }
    
        else{
            
            let nextMessages = await message.find({"recipient":id,
            createdAt: {
                $lte: new Date(date)
            }}).sort({$natural:-1}).limit(amount)

            
            let lastDate;

            let max = false
            if(nextMessages.length < amount){
                max = true
                lastDate = null
            }

            else{
                lastDate =  nextMessages[nextMessages.length-1].createdAt
            }
    
            
            let output =  {
                messages: nextMessages,
                lastDate: nextMessages[nextMessages.length-1].createdAt,
                max:max
            }
            console.log(output)
            return output
        }
    }

        
   catch(error){
       return error
   }


}

//getMessage({id:"63b349f21aa5830d1301421e",amount:2,initialRender:false,date:"2023-01-03T03:55:19.597Z"})

