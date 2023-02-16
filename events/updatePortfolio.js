// update within minute data chart
//update evaluation


// after every blockchain trasnaction the statstics are updated


const mongoose = require("mongoose");
const Portfolio = require('../schemas/userPortfolio')

const path = require('path');

const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})
const getEval = require('../UserRelatedFunctions/UserPortfolio/portfolioEvaluation')
//console.log(process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error);

    })


module.exports = async function update(userID){
    let portfolio = await Portfolio.findOne({userID:userID})
    let eval = (await getEval(userID)).evaluation
    //console.log(eval)
    //let eval = 30
    portfolio.currentPrice = eval
    await portfolio.save()

}

//update("Samar")