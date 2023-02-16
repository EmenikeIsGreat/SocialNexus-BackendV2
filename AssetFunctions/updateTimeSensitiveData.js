const mongoose = require("mongoose");
const assets = require('../schemas/Assets')


const path = require('path');

const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected")
})
    .catch((error)=>{
        console.log(error);

    })



// these refreshers essentially update the time charts based on the cycles. They take the last data within minute data and then add it to spceifed
// chart data array


function refreshMinuteChart(asset){

    let lastElement = asset.stats.withinMinuteData[asset.stats.withinMinuteData.length-1]
    if(asset.minuteChart.length < 60){
        asset.minuteChart.push(lastElement)
        //console.log('less than')
    }

    else{
        asset.minuteChart.shift()
        asset.minuteChart.push(lastElement)
        //console.log('greater than')
    }

    asset.stats.withinMinuteData = [lastElement]
    //console.log(asset)
    return asset

}


function refreshDailyChart(asset){

    let lastElement = asset.stats.withinMinuteData[asset.stats.withinMinuteData.length-1]

    if(asset.dailyChart.length < 24){
        asset.dailyChart.push(lastElement)
        lastElement = []
        //console.log('less than')
    }

    else{
        asset.dailyChart.shift()
        asset.dailyChart.push(lastElement)
        lastElement = []
        //console.log('greater than')
    }

    //console.log(asset)
    return asset

}

function refreshWeeklyChart(asset){

    let lastElement = asset.stats.withinMinuteData[asset.stats.withinMinuteData.length-1]
    if(asset.weeklyChart.length < 7){
        asset.weeklyChart.push(lastElement)
        lastElement = []
        //console.log('less than')
    }

    else{
        asset.weeklyChart.shift()
        asset.weeklyChart.push(lastElement)
        lastElement = []
        //console.log('greater than')
    }

    //console.log(asset)
    return asset

}

function refreshMonthlyChart(asset){

    let lastElement = asset.stats.withinMinuteData[asset.stats.withinMinuteData.length-1]
    if(asset.monthlyChart.length < 30){
        asset.monthlyChart.push(lastElement)
        lastElement = []
        //console.log('less than')
    }

    else{
        asset.monthlyChart.shift()
        asset.monthlyChart.push(lastElement)
        lastElement = []
        //console.log('greater than')
    }


    //console.log(asset)
    return asset

}


function refreshYearlyChart(asset){

    let lastElement = asset.stats.withinMinuteData[asset.stats.withinMinuteData.length-1]

    asset.yearChart.push(lastElement)
    lastElement = []

    //console.log(asset)

    return asset

}




// based of slected time frame update the stat

function refreshChartData(asset,timeFrame){

    let lastElement = asset.stats.withinMinuteData[asset.stats.withinMinuteData.length-1]
    switch(timeFrame){

        case 'minute':
            asset = refreshMinuteChart(asset)
            return asset
       
            break

      
        case 'daily':
            return refreshDailyChart(asset)
            break
    
    
        case 'weekly':

            return refreshWeeklyChart(asset)
            break
    
        case 'monthly':

            return refreshMonthlyChart(asset)
            break
    
        case 'yearly':

            return refreshYearlyChart(asset)
        break
    }
}



// test data

let asset1 = {
    creator: 'test1',
    launchTime: 30,
    initialized: false,
    yearChart: [],
    monthlyChart:Array.from(Array(30).keys()),
    weeklyChart: Array.from(Array(7).keys()),
    dailyChart: Array.from(Array(24).keys()),
    minuteChart:[],
    stats: {
      dailyHigh: 0,
      dailyLow: 0,
      todaysVolume: 0,
      averageVolume: 0,
      highestPeakWeek: 0,
      lowestPeakWeek: 0,
      supply: 10000,
      popularity: 0,
      marketCap: 0,
      volumeAcrossFiveDays: [],
      withinMinuteData: Array.from(Array(25).keys())
    },
    id: "62efe0b10cf4ec94633d3514"
  }


  let asset2 = {
    creator: 'test2',
    launchTime: 30,
    initialized: false,
    yearChart: [],
    monthlyChart:Array.from(Array(30).keys()),
    weeklyChart: Array.from(Array(7).keys()),
    dailyChart: Array.from(Array(24).keys()),
    minuteChart:[],
    stats: {
      dailyHigh: 0,
      dailyLow: 0,
      todaysVolume: 0,
      averageVolume: 0,
      highestPeakWeek: 0,
      lowestPeakWeek: 0,
      supply: 10000,
      popularity: 0,
      marketCap: 0,
      volumeAcrossFiveDays: [],
      withinMinuteData: Array.from(Array(25).keys())
    },
    id: "62efe0b10cf4ec94633d3514"
  }



// this is the intial clock to compare if time has changed
let initialDate = new Date()
let initialYear = initialDate.getFullYear()
let initialMonth = initialDate.getMonth()
let initialDay = initialDate.getDay()
let initialHour = initialDate.getHours()
let initialMinute = initialDate.getMinutes()

// not neccessary now but it broadcast realtime notifcation of the change to who ever is listening...To expensive
const pusher = new Pusher({
    appId: "1426906",
    key: "c6cd91c5c5d1d767214c",
    secret: "11b894da88b794ec76e6",
    cluster: "us2",
    useTLS: true
    });

    
// runs the code that updates the charts
function run(asset){


    // gets the current time when checked and checks if different from initial and the refresh data executes if it is
    let currentdate = new Date();

    //minute data needs to go first because the rest of the updates require you to ge the last element from minute data 

    if(currentdate.getMinutes() != initialMinute){

        refreshChartData(asset, 'minute')
        
        //pusher.trigger("testing", asset.id, asset)
        

    }


    if(currentdate.getFullYear() != initialYear){
        refreshChartData(asset, 'yearly')
    }

    if(currentdate.getMonth() != initialMonth){
        refreshChartData(asset, 'monthly')
    }

    if(currentdate.getDay() == 6){
        refreshChartData(asset, 'weekly')

    }
    
    if(currentdate.getDay() != initialDay){
        if(asset.stats.volumeAcrossFiveDays.length < 5){
            asset.stats.volumeAcrossFiveDays.push(asset.todaysVolume)
            asset.todaysVolume = 0
        }

        else{
            asset.stats.volumeAcrossFiveDays.shift()
            asset.stats.volumeAcrossFiveDays.push(asset.todaysVolume)
            asset.stats.averageVolume = () =>{
                let sum = 0;
                for(let i = 0; i < asset.stats.averageVolume.length; i++){
                    sum += asset.stats.averageVolume[i]
                }

                return sum/5
            }
        }
        refreshChartData(asset, 'daily')
        asset.stats.todaysVolume = 0;
        asset.stats.dailyHigh = 0;
        asset.stats.dailyLow = 0;

    }

    return asset


    
}


// this is the secodn inital checker and its required so that whenever the updateAssets function is called it verfiies if the current minute data
// is different from the inital and then executes
let initialDate2 = new Date()
let initialYear2 = initialDate2.getFullYear()
let initialMonth2 = initialDate2.getMonth()
let initialDay2 = initialDate2.getDay()
let initialHour2 = initialDate2.getHours()
let initialMinute2 = initialDate2.getMinutes()


async function updateAllAssets(){
    
    let currentdate = new Date();

    if(currentdate.getMinutes() != initialMinute2){

        for await (const doc of assets.find()) {
            //console.log(doc)
            let update = await run(doc)
            

            console.log(update)
            // emit the event of the updated asset
            let response = await update.save()
          }

        
        initialDate = new Date() // updates new intial so that it can cycle every minute

          // updates seocn inital so the update stats function can run every minute as well
        let newDate = new Date();
        initialMinute2 = newDate.getMinutes()
        initialDay2 = newDate.getDay()
        initialMonth2 = newDate.getMonth()
        initialYear2 = newDate.getFullYear()
    }




}




setInterval(async ()=>{ 
    await updateAllAssets()
}, 1000);
