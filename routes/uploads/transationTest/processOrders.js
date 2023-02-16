const axios = require('axios')
const transaction = require('../../../Blockchain/wrappedFabConnect/transactions')
const stringify  = require('json-stringify-deterministic');



// let userID = orders[i].userID;
// let assetID = orders[i].assetID
// let orderType = orders[i].orderType
// let tokenAmount = parseFloat(orders[i].tokenAmount)
// let strikePrice = parseFloat(orders[i].strikePrice)
// let slippage = parseFloat(orders[i].slippage)
// let txID = orders[i].txID

let sampleOrder = {
    userID:"Emenike",
    assetID:"Ravetron",
    tokenAmount:"1",
    txID:"test",
    strikePrice:0.1,
    slippage:1000,
    orderType:"Buy"
  }


let server1 = '3.86.52.85'
let server2 = 'localhost'


async function sendOrder(order){

    const res = await axios.post('http://'+server1+':8080/processOrder/addOrder',order)
    console.log(res.data)
}
//sendOrder(sampleOrder)


async function getOrders(){
    const res = await axios.get('http://'+server1+':8080/processOrder/sendMeOrders')
    console.log(res.data)
}

getOrders();



async function emptyOrders(){
    const res = await axios.post('http://'+server1+':8080/processOrder/empty',{permissionToEmpty:true})
    console.log(res.data)

}

//emptyOrders()



async function envokeRawTx(){
    let orders = [sampleOrder]
    //console.log(orders)
    let res = await transaction('executeOrder',["Ravetron",stringify(orders)])

}



//envokeRawTx()




