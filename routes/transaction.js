const express = require('express')
const router = express.Router()

const stringify  = require('json-stringify-deterministic');
const transaction = require('../Blockchain/wrappedFabConnect/transactions')
const hash = require('hash')
const conversion = require('../AssetFunctions/usdToTokens')
const eventHandler = require('../events/eventHandler')
const ExternalAccountTransaction = require('../UserRelatedFunctions/BlockchainCommands/ExternalAccountTransfer')
const getTxFromID = require('../UserRelatedFunctions/get/getTxFromID')
const usdToToken = require('../AssetFunctions/usdToTokens')
//let myHash = new hash()


//const MegaHash = require('megahash');
//var hash = new MegaHash();

/*
myHash.set('a', [1,2,3,4,5,6])
myHash.set('b', [1,2,3,4,5,6])
myHash.set('c', [1,2,3,4,5,6])
myHash.get('a').push(8)
//console.log(myHash)
//myHash.del('a')
console.log(myHash.get('a'))
//myHash.get('a') // undefined

myHash.forEach(function iterator (value, key) {
    console.log(key + ":" + value)
})
*/


let BuySellOrderHash = new hash()
let BidOrderHash = new hash()
let ExternalTxList = []
let Users = new hash()


// can not add deposit and add order that edits two states with the same key
router.post('/empty', async (req,res) =>{
    console.log(req.body)
    console.log("---------------------")
    


    if(req.body.permissionToEmpty){
        // dump the array

        BuySellOrderHash.forEach(async function iterator (value, key) {
            await transaction("executeOrder",[key, stringify(value)])
            console.log(key + " order has been sent")
            BuySellOrderHash.del(key)
        })

        BidOrderHash.forEach(async function iterator (value, key) {

            await transaction("userBid",[key, stringify([order])])
            BidOrderHash.del(key)
        })

        res.send("orders sent")

    }
    else{
        res.send("permission not granted")
    }
    Users = new hash()
})

// adds order to the hashtable

//orderId, UserID, assetID, OrderType, TokenAmount, strikePrices, Slippage


// let sampleOrderBuySell = {
//     orderID: "EmenikeOrderID",
//     userID: "Emenike",
//     assetID: "testCoin",
//     orderType: "Buy",
//     tokenAmount: 1,
//     strikePrice: 111.11,
//     slippage: 0.01
// }


// let userID = orders[i].userID;
// let assetID = orders[i].assetID
// let orderType = orders[i].orderType
// let tokenAmount = parseFloat(orders[i].tokenAmount)
// let strikePrice = parseFloat(orders[i].strikePrice)
// let slippage = parseFloat(orders[i].slippage)
// let txID = orders[i].txID


// let sampleOrderBid = {
//     orderID: "EmenikeOrderID",
//     userID: "Emenike",
//     assetID: "testCoin",
//     orderType: "Bid",
//     usdsn: 20
// }


router.post('/addOrder', async (req,res) =>{
    console.log(req.body.userID)
    if(Users.get(req.body.userID) == undefined){

        console.log("did not find")
        Users.set(req.body.userID,true)
        
    }

    else{
        console.log("Found")
        res.send({orderRecieved:false})
        return
    }

    console.log(Users)
    
    let order = req.body
    console.log("------------recieved Order------------")
    console.log(order)
    if(order.orderType == "Bid"){
    
        /* basically stating that if their arent any orders for a patircular asset in te hashmap already
            then just send the orders directly and creat a space in the hahs map for the assetID so new
            orders have to wait until given the command to be sent
        */
        if(BidOrderHash.get(order.assetID) == undefined){
            BidOrderHash.set(order.assetID, [])
    
            await transaction("userBid",[order.assetID, stringify([order])])
    
        }
    
        else{
            BidOrderHash.get(order.assetID).push(order)
        }
    
        res.send("order recieved: " + order)
    }

    else{
        /* basically stating that if their arent any orders for a patircular asset in te hashmap already
            then just send the orders directly and creat a space in the hahs map for the assetID so new
            orders have to wait until given the command to be sent
        */
        
        if(BuySellOrderHash.get(order.assetID) == undefined){
            BuySellOrderHash.set(order.assetID, [])
    
            await transaction("executeOrder",[order.assetID, stringify([order])], false)
    
        }
    
        else{
            BuySellOrderHash.get(order.assetID).push(order)
        }


        res.send({orderRecieved:true})
    }

    
})



// testing purposes
router.get('/sendMeOrders', (req,res) =>{
    
    res.send({BuySellOrders:BuySellOrderHash, BidOrder: BidOrderHash})
    
})

router.get('/conversion', async (req,res) =>{
    let {assetID,txStatus,amount} = req.query.data

    let response = await conversion(assetID, txStatus, amount)
    res.send(response)
    
})


// need to check on this to see if it works
router.post('/HandleEvent', async (req,res) =>{
    console.log("Handeling event")
    console.log("-------------PROCESSING BLOCKCHAIN EVENTS--------------")
    await eventHandler(req.body)
    res.end()
})

router.post('/AddExternalTx', async (req,res) =>{

    console.log("-------Processing Order--------")
    console.log(req.body)
    console.log("-------Processing Order--------")
    let {txid,id,amount,deposit} = req.body
    ExternalTxList.push(req.body)
    let response = await ExternalAccountTransaction(txid, id, amount, deposit)
    res.send(response)
    res.end()
})

router.get('/getTxFromID', async (req,res) =>{


    let {id} = req.query
    let response = await getTxFromID(id)
    console.log("This is the tx id")
    console.log(response)
    
    res.send(response)
   
    res.end()
})

router.get('/conversionUsdToToken', async (req,res) =>{


    let {assetID, txStatus, amount} = req.query
    let response = await usdToToken(assetID,txStatus,amount)
    console.log("This is the tx id")
    console.log(response)
    
    res.send(response)
   
    res.end()
})









module.exports = router
