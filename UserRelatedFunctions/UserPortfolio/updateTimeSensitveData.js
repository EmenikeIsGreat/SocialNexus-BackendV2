const mongoose = require("mongoose");
const User_Portfolio = require('../../schemas/userPortfolio')
const Asset = require('../../schemas/Assets')
const query = require('../../Blockchain/wrappedFabConnect/query')
const calculateTotalValOfUsersPortfolio = require('./portfolioEvaluation')
const stringify = require('json-stringify-deterministic');




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

//node updateTimeSensitveData


let prices;
//prices = getAllPrices().then((data)=>console.log(data['ArinzeAsset']))
//prices = { ArinzeAsset: 0.2 }


async function calculateTotalValOfUsersPortfolio(userID){


    let usersBalance = await query('getUser', [userID])
    usersBalance = usersBalance.result
 
    
    let totalAssetEvalInUSD = 0

    //testing
    
    // let prices = [{asset:"LP", price:40},{asset:"JP", price:40}, 
    //             {asset:"kP", price:40},{asset:"yP", price:40}, 
    //             {asset:"rP", price:40}, {asset:"fP", price:40}, 
    //             {asset:"jP", price:40}]
    


    let usersAsset = Object.keys(usersBalance)

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


       
    }

    return totalAssetEvalInUSD
}


//calculateTotalValOfUsersPortfolio("63a8c5d2e47fb161d4472337")



function modifyChartDataArray(array, valuation, limit){


    if(limit == null){
        limit =  Number.MAX_SAFE_INTEGER + 1
    }

    if(array.length < limit){
        array.push(valuation)
        //console.log('less than')
    }

    else{
        array.shift()
        array.push(valuation)

        //console.log('greater than')
    }

    return array
}


function updateChartData(portfolio, valuation, timeFrame){



    switch(timeFrame){
        case 'yearly':
            portfolio.yearlyChart = modifyChartDataArray(portfolio.yearlyChart, valuation, null)
            break
        case "monthly":
            portfolio.monthlyChart = modifyChartDataArray(portfolio.monthlyChart, valuation, 12)
            break
        
        case "weekly":

            portfolio.weeklyChart = modifyChartDataArray(portfolio.weeklyChart, valuation, 52)
            break
        case "daily":
            portfolio.dailyChart = modifyChartDataArray(portfolio.dailyChart, valuation, 365)
            break
        case 'minute':

            portfolio.minuteChart = modifyChartDataArray(portfolio.minuteChart, valuation, 60)
            break

        default:
            console.log("no options")
    }

    return portfolio

}



function updateStats(portfolio, evaluation){
    

    portfolio.currentPrice = evaluation
    
    if(portfolio.yearlyChart.length > 1){

        portfolio.stats.deltaYear = (portfolio.yearlyChart[portfolio.yearlyChart.length-1] - 
            portfolio.yearlyChart[portfolio.yearlyChart.length-2])/portfolio.yearlyChart[portfolio.yearlyChart.length-2]

    }

    if(portfolio.monthlyChart.length > 1){

        portfolio.stats.deltaMonth = (portfolio.monthlyChart[portfolio.monthlyChart.length-1] - 
            portfolio.monthlyChart[portfolio.monthlyChart.length-2])/portfolio.monthlyChart[portfolio.monthlyChart.length-2]

    }


    if(portfolio.weeklyChart.length > 1){
        
        portfolio.stats.deltaWeek = (portfolio.weeklyChart[portfolio.weeklyChart.length-1] - 
            portfolio.weeklyChart[portfolio.weeklyChart.length-2])/portfolio.weeklyChart[portfolio.weeklyChart.length-2]
  
    }


    if(portfolio.dailyChart.length > 1){
        portfolio.stats.deltaDay = (portfolio.dailyChart[portfolio.dailyChart.length-1] - 
            portfolio.dailyChart[portfolio.dailyChart.length-2])/portfolio.dailyChart[portfolio.dailyChart.length-2]
    }
    
    return portfolio
}


let initialDate = new Date()
let initialYear = initialDate.getFullYear()
let initialMonth = initialDate.getMonth()
let initialDay = initialDate.getDay()
let initialHour = initialDate.getHours()
let initialMinute = initialDate.getMinutes()


function run(portfolio, valuation){
  


    let currentdate = new Date();


    if(currentdate.getFullYear() != initialYear){
        // run updateUsersPortofilio functin
        updateChartData(portfolio,valuation,'yearly')
    }

    if(currentdate.getMonth() != initialMonth){
        // run updateUsersPortofilio functin   
        updateChartData(portfolio,valuation,'monthly') 
    }

    if(currentdate.getDay() == 6){
        // run updateUsersPortofilio functin    
        updateChartData(portfolio,valuation,'weekly')
    }
    
    if(currentdate.getDay() != initialDay){
        // run updateUsersPortofilio functin   
        updateChartData(portfolio,valuation,'daily') 
    }

    if(currentdate.getMinutes() != initialMinute){
        
        console.log("this needs to run")
        updateChartData(portfolio,valuation,'minute')

    }
    
    // get the user ID of the portfolio and save it to the database

    //console.log("Seconds: " + currentdate.getSeconds())


    
    updateStats(portfolio, valuation)
    

    //return portfolio




}






let initialDate2 = new Date()
let initialYear2 = initialDate2.getFullYear()
let initialMonth2 = initialDate2.getMonth()
let initialDay2 = initialDate2.getDay()
let initialHour2 = initialDate2.getHours()
let initialMinute2 = initialDate2.getMinutes()


async function getAllPrices(){
    let returnVal = await Asset.find().select('name -_id');
    
    let assetNames = []

    let priceJson = {}
    for(i = 0; i < returnVal.length; i++){
        assetNames.push(returnVal[i].name)
    }
    
    let prices = await query('getPrice',[stringify(assetNames)])
    prices = prices.result
    
    for(i = 0; i < prices.length; i++){
        priceJson[prices[i].asset] = prices[i].price
    }

    //console.log(priceJson)
    return priceJson
}



async function updateAllUsersPortfolio(){
    let currentdate = new Date();
    console.log("Seconds: " + currentdate.getSeconds())
    if(currentdate.getMinutes() != initialMinute2){

        prices = await getAllPrices()

        for await (const doc of User_Portfolio.find()) {
            let totalValuation = await calculateTotalValOfUsersPortfolio(doc.userID)
           
            if(totalValuation.active == false){
                continue;
            } 

            run(doc, totalValuation)
            let response = await doc.save()
            console.log(response)
          }

        let newDate = new Date();
        initialMinute2 = newDate.getMinutes()
        initialDay2 = newDate.getDay()
        initialMonth2 = newDate.getMonth()
        initialYear2 = newDate.getFullYear()
    }

}


// node updateTimeSensitveData

let currentdate = new Date();


setInterval(async ()=>{
    await updateAllUsersPortfolio()

}, 5000)









//testing6()


async function testing3(){
    let response = await User_Portfolio.find()
    console.log(response)
}

//testing3()

async function testing4(){
    for await (const doc of User_Portfolio.find()) {
        doc.userID = "Emenike is the goat"
        let response = await doc.save()
        console.log(response)
      }
    }

//testing4()