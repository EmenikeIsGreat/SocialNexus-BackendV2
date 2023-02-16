const mongoose = require("mongoose");
const User_Portfolio = require('../../schemas/userPortfolio')





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


async function doIt(){
    let response = await User_Portfolio.findOne({userID:"63b79170871e180d114f80c9"})
    //console.log(response)
    response.dailyChart = Array.from({length: 40}, () => Math.floor(Math.random() * 40));
    response.weeklyChart = Array.from({length: 40}, () => Math.floor(Math.random() * 40));
    response.monthlyChart = Array.from({length: 40}, () => Math.floor(Math.random() * 40));
    response.yearlyChart = Array.from({length: 40}, () => Math.floor(Math.random() * 40));

    let final = await response.save();

    console.log(final)
}
doIt()
