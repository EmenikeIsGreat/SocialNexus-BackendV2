const tx = require('../schemas/transaction')
const blockTx = require('../Blockchain/wrappedFabConnect/transactions')
const createMessage = require('../Notification/createMessage')
const updateStatistics = require('../AssetFunctions/updateStatistics')
const updatePortfolio = require ('./updatePortfolio')
require('dotenv').config()
const path = require('path');
const {stringify}  = require("json-stringify-deterministic/lib/defaults")
const mongoose = require("mongoose");
const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log("connected")
})
  .catch((error)=>{
      console.log(error);

  })
// this code is responsible for taking events from the blockchain and sending them as  notifcications to the user


let sampleAssetEvent = {
    UserID:"62b750b69e2542d58f9721c6",
    Type: "RecievedAssetFromInit",
    Transaction:{
        Type:"InitAsset",
        orderID: "test123",
        AssetID: "EmenikeID3",
        AssetAmount: 20,
        USDSHAmount: 20,
        StrikePrice: 37,
        fee: 30,
        NewPriceOfAsset: 44
    },
    UserBalance:{
        USDSH: 27,
        ArinzeCoin: 38
    }
}


let sampleOrderEvent = {
    UserID:"62b750b69e2542d58f9721c6",
    Type: "Order",
    Transaction:{
        Type:"Buy",
        orderID: "test123",
        AssetID: "62f2fa563471195687a3f0e8",
        AssetAmount: 40,
        USDSHAmount: 20,
        StrikePrice: 37,
        fee: 30,
        NewPriceOfAsset: 47,
    },
    UserBalance:{
        USDSH: 27,
        EmenikeCoin: 38
    }
}

let sampleBidEvent = {
    UserID:"62b750b69e2542d58f9721c6",
    Type: "Bid",
    Transaction:{
        BidID: "test123",
        AssetID: "EmenikeID",
        USDSHAmount: 60,
    },
    UserBalance:{
        USDSH: 26,
        EmenikeCoin: 35
    }
}


let sampleExternalEvent = {
    UserID:"62f7fdd597c2ceea6ad4595c",
    Type: "External",
    
    Transaction:{
        External: "deposit",
        USDSHAmount: 20,
    },

    UserBalance:{
        USDSH: 25,
        EmenikeCoin: 35
    }
}

module.exports = async function TxProcessing(events){
    
    for(i = 0; i < events.length ; i++){
        let event = events[i].payload
        console.log(event);

        switch (event.Type){
            
            case "Order":
                console.log("processing Orders")
                
                let transaction1 = await tx.create({
                    External:false,
                    Type: event.Transaction.Type,
                    UserID: event.UserID,
                    OrderID: event.Transaction.orderID,
                    Transaction: event.Transaction,
                })

                let response = await updateStatistics(event.Transaction.AssetID, 
                                    event.Transaction.NewPriceOfAsset,  
                                    event.Transaction.AssetAmount)

                let res = await updatePortfolio(event.UserID)

                
                let json = {
                    final:true
                }
                
               let message = event.Transaction.orderID + "final"
               console.log(message)
                
               let updateTxState = blockTx("saveTxID",[message,stringify(json)])

            
                await createMessage("SocialNexus",event.UserID,event.Transaction)
                break
            

            // this is when asset is initalized
            case "RecievedAssetFromInit":
                console.log("RecievedAssetFromInit")
  
                let transaction2 = await tx.create({
                    External:false,
                    Type: event.Transaction.Type,
                    UserID: event.UserID,
                    OrderID: event.Transaction.orderID,
                    Transaction: event.Transaction,
                })
                
                let intializationResponse = updatePortfolio(event.UserID)
                // update asset


                break
            

            // this is for when a user makes a bid
            case "Bid":
                console.log("Bid")
 
                let transaction3 = await tx.create({
                    External:false,
                    Type: event.Transaction.Type,
                    UserID: event.UserID,
                    OrderID: event.Transaction.orderID,
                    Transaction: event.Transaction,
                })
          
                break
            

            // this is for deposit and withdraw
            case "External":
                console.log("processing external transactions")
                let transaction4 = await tx.create({
                    External:true,
                    Type: event.Transaction.External,
                    UserID: event.UserID,
                    OrderID: event.Transaction.orderID,
                    Transaction: event.Transaction,
                })
                console.log("hitting")
                await createMessage(event.UserID, event.Transaction) 
                break 

    
            default:
                console.log("no events match")
        }


    }
        

}

//TxProcessing(sampleAssetEvent)
// let message = "final"
// console.log(message)

         
// let json = {
//     final:true
// }
 
// let updateTxState = blockTx("saveTxID",["message",stringify(json)])