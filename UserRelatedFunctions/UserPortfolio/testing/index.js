const {stringify}  = require("json-stringify-deterministic/lib/defaults")

const transaction = require("../../../Blockchain/wrappedFabConnect/transactions")
const query = require('../../../Blockchain/wrappedFabConnect/query')

// create User


// transaction('createUser',["63b79170871e180d114f80c9"])
//transaction('createUser',["Emenike"])
// transaction('createUser',["Samar"])
// transaction('createUser',["Adanna"])
// transaction('createUser',["Izunna"])
//transaction('createUser',["Nike"])




//deposit money in User's account


//transaction('deposit',["sample","Nike","1000000000000000000","true"])
//transaction('createUser',["Nike"])




//create Asset

//transaction('createAsset',["fake","fake"])



// query("getAsset", ["skilled"]).then((data)=>{
//     console.log(data.result)
// })









//Bid on Asset


let sampleBid = [{
  id:"test",
  userID:"Emenike",
  assetID:"Ravetron",
  usdsn:"1",
  txID:"test"
}]



//transaction('userBid',["Izzy",stringify(sampleBid)])
//transaction('userBid',["NZ",stringify(sampleBid)])
//transaction('userBid',["SumSum",stringify(sampleBid)])
//transaction('userBid',["Ravetron",stringify(sampleBid)])
//transaction('userBid',["fake",stringify(sampleBid)])


// intialize Asset
//transaction('initalizeAssets',["Izzy"])
//transaction('initalizeAssets',["Adaze"])
//transaction('initalizeAssets',["SumSum"])
//transaction('initalizeAssets',["Ravetron"])
// transaction('initalizeAssets',["NZ"])


// save TXID

let json = {
  final:true
}
//let res = transaction("saveTxID",["sample",stringify(json)])
// query("get", ["sample"]).then((data)=>{
//    console.log(data.result.final)
//  })



let sampleOrder = [{
  userID:"notUsed",
  assetID:"fake",
  tokenAmount:"1",
  txID:"test",
  strikePrice:0.1,
  slippage:1000,
  orderType:"Buy"
}]

//transaction('executeOrder',["fake",stringify(sampleOrder)])

// testing getPrice


let assetNames = [ 'fake' ]

async function getPrice(){
  let getPriceOfAsset = await query("getPrice", [stringify(assetNames),"false"])
  console.log(getPriceOfAsset.result[0].price)
}

//getPrice()

// query("getUser", ["63b79170871e180d114f80c9"]).then((data)=>{
//   console.log("Samar: " + stringify(data.result))
// })


// let assetID = "fake"
// query("get", ["fake_LP"]).then((data)=>{
//   console.log(stringify(data.result))
// })


// query("getAsset", ["fake"]).then((data)=>{
//     console.log(data.result)
// })

// query("checkAssetBalance", ["notUsed","fake",2]).then((data)=>{
//   console.log(data.result)
// })



// query("getAsset", ["unusual"]).then((data)=>{
//     console.log(data.result)
// })

// query("getAsset", ["fake"]).then((data)=>{
//     console.log(data.result)
// })

// query("getAsset", ["Emenike"]).then((data)=>{
//     console.log(data)
// })

// query("getAsset", ["Adaeze"]).then((data)=>{
//     console.log(data.result)
// })


// query("getUser", ["NZ"]).then((data)=>{
//     console.log(data.result)
// // })

// query("get", ["fake_LP"]).then((data)=>{
//     console.log(data.result)
// })
// query("getAsset", ["fake"]).then((data)=>{
//   console.log(data.result)
// })

// query("getPrice", ["fake","true"]).then((data)=>{
//   console.log(data.result)
// })


query("get", ["sample100"]).then((data)=>{
  console.log(data.result)
})









