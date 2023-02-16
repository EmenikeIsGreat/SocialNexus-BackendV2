const mongoose = require("mongoose");
const query = require('../../Blockchain/wrappedFabConnect/query')
const Asset = require('../../schemas/Assets')
const stringify = require('json-stringify-deterministic');

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


async function getAllPrices(){
    let returnVal = await Asset.find().select('name -_id');
    let assetNames = []

    let priceJson = {}
    for(i = 0; i < returnVal.length; i++){
        assetNames.push(returnVal[i].name)
    }

    //console.log(assetNames)

    
    let prices = await query('getPrice',[stringify(assetNames),"false"])
    prices = prices.result
    console.log(prices)
    for(let i = 0; i < prices.length; i++){
        priceJson[prices[i].asset] = prices[i].price
    }

    //console.log(priceJson)
    return priceJson
}

//getAllPrices()

module.exports = async function calculateTotalValOfUsersPortfolio(userID){

    let prices = await getAllPrices();
    let usersBalance = await query('getUser', [userID])
    usersBalance = usersBalance.result
    //console.log(usersBalance)
    
    let totalAssetEvalInUSD = 0

    //testing
    
    // let prices = [{asset:"LP", price:40},{asset:"JP", price:40}, 
    //             {asset:"kP", price:40},{asset:"yP", price:40}, 
    //             {asset:"rP", price:40}, {asset:"fP", price:40}, 
    //             {asset:"jP", price:40}]
    


    let usersAsset = Object.keys(usersBalance)
    let dollarValueJSON = {
        dollarValue:{},
        evaluation:0
    }
    for(let i = 0; i < Object.keys(usersBalance).length; i++){
        
        if(usersAsset[i] == "USDSH"){
            continue;
        }

        if(Object.keys(usersBalance[usersAsset[i]]) == 'Bid'){
            continue
        }



        let tokenShare = parseFloat(usersBalance[usersAsset[i]].balance)

        let assetPPS = parseFloat(prices[usersAsset[i]])

   
        let totalValuationOfAssetInUSD = tokenShare*assetPPS
        totalAssetEvalInUSD += totalValuationOfAssetInUSD
        dollarValueJSON.dollarValue[usersAsset[i]] = {cost:totalValuationOfAssetInUSD,tokenAmount:tokenShare}

       
    }

    dollarValueJSON.evaluation = totalAssetEvalInUSD
    //console.log(dollarValueJSON)
    return dollarValueJSON
}

//calculateTotalValOfUsersPortfolio("63b79170871e180d114f80c9")



