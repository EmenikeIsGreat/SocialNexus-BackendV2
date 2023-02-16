
const axios = require('axios')
const bcrypt = require("bcryptjs")


let sampleOrderBuySell = {
    orderID: "EmenikeOrderID",
    userID: "Emenike",
    assetID: "skilled",
    orderType: "Buy",
    tokenAmount: 1,
    strikePrice: 111.11,
    slippage: 100000000000000000
}


let sampleOrderBid = {
    orderID: "EmenikeOrderID",
    UserID: "Emenike",
    assetID: "skilled",
    orderType: "Bid",
    usdsn: 20
}

async function sendOrder(jsonInfo){
    const res = await axios.post('http://localhost:8080/processOrder/addOrder',sampleOrderBuySell)
    console.log(res.data)
}


sendOrder(sampleOrderBuySell)

async function test(){
    const res = await axios.get('http://localhost:8080/test')
    console.log(res)
}

//test()

async function getOrdersTest(){
    const res = await axios.get('http://localhost:8080/processOrder/sendMeOrders')
    console.log(res.data)
}

//getOrdersTest()


