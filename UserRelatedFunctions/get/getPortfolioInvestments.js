const Assets = require('../../schemas/Assets')
const mongoose = require("mongoose");
const getUserBalance = require('./getUserBalance')
const chainQuery = require("../../Blockchain/wrappedFabConnect/query")
const portfolioEvaluation = require('../UserPortfolio/portfolioEvaluation')
const userPortfolio = require('../../schemas/userPortfolio')
const stringify = require('json-stringify-deterministic');


const path = require('path');
const { text } = require('express');

const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})

//console.log(process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error);

    })

module.exports = async function getUsersPortfolio(id){

    const portEvaluation = await portfolioEvaluation(id)
    const evluation = portEvaluation.evaluation
    const userBalances = (await chainQuery("getUser",[id])).result

    const portfolio = await userPortfolio.findOne({userID:id});
    console.log("---------------")
    const assetKeys = Object.keys(userBalances)
    
    let balances = []
    let bids = {}
    for(i = 0; i < assetKeys.length; i++){

        let isBid = Object.keys(userBalances[assetKeys[i]]).includes("Bid") ? true : false

        if(assetKeys[i] == "USDSH" && !isBid){
            continue;
        }

        if(isBid){
            bids[assetKeys[i]] = userBalances[assetKeys[i]]; 
        }
        let assetName = assetKeys[i];
        let assetJSON = await Assets.findOne({name:assetName})
        
        let deltas = {
            deltaDay:assetJSON.stats.deltaDay,
            deltaWeek:assetJSON.stats.deltaWeek,
            deltaMonth:assetJSON.stats.deltaMonth,
            deltaYear:assetJSON.stats.deltaYear
        }
        
        console.log(portEvaluation.dollarValue[assetName])
        console.log(assetName)
        console.log('---------------')
        let tempJSON = {
            deltas:deltas,
            name:assetName,
            dollarValue:portEvaluation.dollarValue[assetName].cost,
            tokenAmount: portEvaluation.dollarValue[assetName].tokenAmount

        }
       
        balances.push(tempJSON)


        // userBalances[assetName].deltas = deltas;
        // userBalances[assetName].name = assetName;
        // userBalances[assetName].dollarValue = portEvaluation.dollarValue[assetName]
    }
    let returnVal = {
        portfolio,
        evaluation:evluation,
        balances: balances,
        bids:bids
    }

    console.log(returnVal.balances)

    return returnVal


}

//getUsersPortfolio('63b79170871e180d114f80c9')


async function getVal(){
    let bids = {}
    const userBalances = (await chainQuery("getUser",["notUsed"])).result
    const assetKeys = Object.keys(userBalances)
    console.log(assetKeys)
    let isBid = Object.keys(userBalances[assetKeys[0]]).includes("Bid") ? true : false
    console.log(isBid)
    bids[assetKeys[0]] = userBalances[assetKeys[0]]
    console.log(bids)
}

//getVal()