/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

/*
error codes

1 - not enough balance
2 - not within slippage

*/

class AssetTransfer extends Contract {

    orderFee = 0;
    withDepoFee = 0.15;
    transferFee = 0;
    totalCollectedFees = 0;


    async setOrderFee(amount){
        this.orderFee = amount;
    }

        
    async setTransferFee(amount){
        this.transferFee = amount;
    }

    async setIOFee(amount){
        this.withDepoFee = amount;
    }

    async InitContract(ctx, orderFee, withDepoFee, transferFee){
        await this.setOrderFee(ctx, orderFee);
        await this.setWithDepoFee(ctx, withDepoFee);
        await this.setTransferFee(ctx, transferFee)
        await this.createUser(ctx, "SocialNexus")
    }

    async getOrderFee(){
        return this.orderFee
    }

    async getWithDepoFee(){
        return this.withDepoFee;
    }

    async getTransferFee(){
        return this.transferFee;
    }


    async saveTxID(ctx, txID, value){
        await ctx.stub.putState(txID, Buffer.from(stringify(value)))
    }

    async getOrder(ctx, txID){

        let value = await ctx.stub.getState(txID);

        if(value.length == 0){
            return false
        }
        else{
            return JSON.parse(value);
        }
    }

    async get(ctx, id){
        let value = await ctx.stub.getState(id);
        if (!value || value.length === 0) {
            return {
                value:null
            }
          }
        else{
            let valueJson = JSON.parse(value);
            return valueJson
        }

    }

    async getUser(ctx, UserID){
        let userPreJson = await ctx.stub.getState(UserID);
        let userJson = JSON.parse(userPreJson);
        return userJson
    }

    async getBalance(ctx, userID){
        let user = await this.getUser(ctx, userID)
        return user.USDSH
    }

    
    async createUser(ctx, UserID) {
        //testing remove later
        let balanceObj = {
            USDSH : {
                balance : 0
            }
        }


        await ctx.stub.putState(UserID, Buffer.from(stringify(balanceObj)));

        balanceObj.userID = UserID;

        let createUserEvent = {
            Type:"CreateUser",
            UserID: UserID,
            status: true
        }
       await ctx.stub.setEvent('event', Buffer.from(stringify(createUserEvent)));
    }


    
    async createAsset(ctx, AssetID, UserID){

        let assetObj = {
            Creator : UserID,
            amountRaised : 0,
            fees: 0,
            Bidders : {

            },
            reserves:10000000000
        }

        let asset_LP = {

        }

        let createAssetEvent = {
            Type:"CreateAsset",
            UserID: UserID,
            AssetID: AssetID, 
        }
        await ctx.stub.setEvent('CreatedAsset', Buffer.from(stringify(createAssetEvent)));
        await ctx.stub.putState(AssetID, Buffer.from(stringify(assetObj)));
        await ctx.stub.putState(AssetID + "_LP", Buffer.from(stringify(asset_LP)));

    }




    async getAsset(ctx, AssetID){
        let AssetPreJson = await ctx.stub.getState(AssetID);
        let AssetJson = JSON.parse(AssetPreJson);
        return AssetJson
    }

    
    
    async hasBalance(ctx, UserID, amount){
        amount = parseFloat(amount);
        let userBal = await this.getUser(ctx, UserID);
        
        if(userBal.USDSH.balance < amount){
            return false
        }

        else{
            return true
        }
    }

    incrementCollectedFees(amount){
        this.totalCollectedFees += amount;
    }

    getTotalFees(){
        return this.totalCollectedFees
    }

    async collectFees(){
        let SocialNexus = JSON.parse(await this.getUser(ctx, "SocialNexus"));
        SocialNexus.USDSH.balance += this.transferFee;
        this.transferFee = 0;
    }
  
    async deposit(ctx, txID, userID,amount, modify){

        amount = parseFloat(amount);
        if(typeof(modify) === 'string'){
            if(modify == "true"){
                modify = true
            }

            else{
                modify = false
            }
        
        }
        let userJson = await this.getUser(ctx, userID);
        if(modify){

            let fee = amount*this.withDepoFee
            userJson.USDSH.balance = userJson.USDSH.balance + (amount - fee)

            let externalEvent = {
                UserID:userID,
                Type: "External",
                
                Transaction:{
                    txID:txID,
                    External: "deposit",
                    USDSHAmount: amount-fee,
                    fee: fee
                },
            
                UserBalance:userJson.USDSH
            }

            if(userID == "SocialNexus"){
                return
            }
            this.incrementCollectedFees(fee)
            await ctx.stub.setEvent('event', Buffer.from(stringify(externalEvent)))
            await ctx.stub.putState(txID, Buffer.from(stringify(externalEvent)));
            await ctx.stub.putState(userID, Buffer.from(stringify(userJson)));
        }

        else{
            userJson.USDSH.balance = userJson.USDSH.balance + amount;
            return userJson;
        }
        

    }


    async withdraw(ctx, txID, userID, amount, modify){

        amount = parseFloat(amount)
        let fee = amount*this.withDepoFee;

        if(typeof modify === 'string'){
            if(modify == "true"){
                modify = true
            }

            else{
                modify = false
            }
        
        }
        

        let userJson = await this.getUser(ctx, userID);    

        let bal = await this.hasBalance(ctx, userID, amount)
        

        userJson.USDSH.balance = userJson.USDSH.balance - (amount)
        
        let externalEvent = {
            UserID:userID,
            Type: "External",
            txID:txID,
            Transaction:{
                External: "withdraw",
                USDSHAmount: amount-fee,
                fee: fee,
                valid: false
            }
        }

        if(!modify){
            userJson.USDSH.balance = userJson.USDSH.balance - amount
            return userJson
        }

        else{
            if(!bal){
                await ctx.stub.putState(txID, Buffer.from(stringify(externalEvent)));
                return
            }

            else{
                this.incrementCollectedFees(fee)
                externalEvent.UserBalance = userJson.USDSH
                externalEvent.Transaction.valid = true
                //await this.deposit(ctx, "SocialNexus", fee, true)
                await ctx.stub.setEvent('event', Buffer.from(stringify(externalEvent)))
                await ctx.stub.putState(txID, Buffer.from(stringify(externalEvent)));
                await ctx.stub.putState(userID, Buffer.from(stringify(userJson)));
                return
            }
        }

    }


    async userBid(ctx, assetID, orders){
        let asset = await this.getAsset(ctx, assetID)
        orders = JSON.parse(orders)
        for(let i = 0; i < orders.length; i++){

    
            let id = orders[i].id
            let userID = orders[i].userID;
            let assetID = orders[i].assetID
            let usdsn = parseFloat(orders[i].usdsn)
            let txID = orders[i].txID

            let user = await this.getUser(ctx, userID)

            if(asset.Creator == userID){
                let val = {
                    action: "userBid",
                    errorCode: 3
                }
                await this.saveTxID(id,val)
                return
            }

            let fee = usdsn * this.orderFee
            let totalCost = fee + usdsn

            let hasBalance = await this.hasBalance(ctx, userID, totalCost)
            
            if(!hasBalance){

                return
            }

            user.USDSH.balance = user.USDSH.balance - totalCost
            asset.amountRaised = asset.amountRaised + usdsn;
            asset.fees = parseFloat(asset.fees) + fee

            let usersNewBid = {Bid:usdsn}

            user[assetID] = usersNewBid

    

            if(asset.Bidders[userID] != undefined){
                asset.Bidders[userID].Bid = parseFloat(asset.Bidders[userID].Bid) + usdsn;
            }
            
            else{
                
                let userBid = {
                    Bid : usdsn
            
                }
                asset.Bidders[userID] = userBid;
            }

            await ctx.stub.putState(userID, Buffer.from(stringify(user)));
            

            let bidEvent = {
                UserID:userID,
                Type: "Bid",
                txID:txID,
                Transaction:{
                    BidID: id,
                    AssetID: assetID,
                    USDSHAmount: usdsn,
                    fees: fee,
                    fee: this.orderFee
                },
                UserBalance: user
            }
            
            this.incrementCollectedFees(fee)
            await ctx.stub.setEvent('event', Buffer.from(stringify(bidEvent)));
            await ctx.stub.putState(txID, Buffer.from(stringify(bidEvent)));

        }

        await ctx.stub.putState(assetID, Buffer.from(stringify(asset)));
    }


    async initalizeAssets(ctx, txID, AssetID){
        
        // this needs to be tested 
        let poolAllocation = 0.01
        let totalSupply = 1000;

        let asset = await this.getAsset(ctx, AssetID);
        
        let amountRaised = parseFloat(asset.amountRaised);
        
        let AssetAllocatedToPool = totalSupply * poolAllocation;
        let USDSHAllocatedToPool = amountRaised * poolAllocation;
        let k = AssetAllocatedToPool * USDSHAllocatedToPool;
        
        let LP = {
            "Asset" : AssetAllocatedToPool,
            "USDSH" : USDSHAllocatedToPool,
            "K_Constant": k
        }

        asset.LP = LP
        await ctx.stub.putState(AssetID, Buffer.from(stringify(asset)));


        totalSupply = totalSupply - AssetAllocatedToPool;
        amountRaised = amountRaised - USDSHAllocatedToPool;
        let tokenPerDollar = totalSupply/amountRaised;
        let strikePrice = amountRaised/totalSupply

    
        for (const key in asset.Bidders){
            let user = await this.getUser(ctx, key);
            let UsersTokens = parseFloat(asset.Bidders[key].Bid) * tokenPerDollar;
        
            
            let balanceOBj = {
                balance : UsersTokens
            }
            user[AssetID] = balanceOBj;
            await ctx.stub.putState(key, Buffer.from(stringify(user)));


            let assetEvent = {
                UserID:key,
                Type: "RecievedAssetFromInit",
                Transaction:{
                    Type:"InitAsset",
                    AssetID: AssetID,
                    AssetAmount: UsersTokens,
                    USDSHAmount: asset.Bidders[key].Bid,
                    StrikePrice: strikePrice,
                },
                UserBalance:user
            }

            let txJson = {
                valid:true
            }
            await ctx.stub.setEvent('event', Buffer.from(stringify(assetEvent)));
            await ctx.stub.putState(AssetID+"-Initialized", Buffer.from(stringify(txJson)))
        }

    }


    Liquity_Pool_Math(LP_Obj, TokenTrasnactionAmount, tx_Status, modify){
        TokenTrasnactionAmount = parseFloat(TokenTrasnactionAmount);
        if(typeof modify === 'string'){
            if(modify == "true"){
                modify = true
            }

            else{
                modify = false
            }
        
        }
    
        // this is subject to change
        let Asset = parseFloat(LP_Obj.Asset)
        let USDSH = parseFloat(LP_Obj.USDSH)
        let k = parseFloat(LP_Obj.K_Constant)
        
        let payment;
        if(tx_Status == "Buy"){
            let payment = (k/(Asset - TokenTrasnactionAmount)) - USDSH;
            //console.log("you need to pay $" + payment)


            if(modify == true){
                LP_Obj.Asset = Asset - TokenTrasnactionAmount;
                LP_Obj.USDSH = USDSH + payment;

            }
            
            let returnVar = {
                amount: payment,
                LP: LP_Obj

            }
            return returnVar
        }
    
        else{
            let payment = USDSH - (k/(Asset + TokenTrasnactionAmount));
            
            if(modify == true){
                LP_Obj.Asset = Asset + TokenTrasnactionAmount;
                LP_Obj.USDSH = USDSH - payment;
   
            }


            let returnVar = {
                amount: payment,
                LP: LP_Obj

            }
            return returnVar
        }
    }

    async test_LP_Math(ctx, AssetID, TokenTrasnactionAmount, tx_Status, modify){
        let asset = await this.getAsset(ctx, AssetID);
        let lpObj = asset.LP;

        let LP = this.Liquity_Pool_Math(lpObj, parseFloat(TokenTrasnactionAmount), tx_Status, modify)

        return LP


    }

    async usdToTokenCalculator(ctx,AssetID,usdAmount,tx_Status){
        let asset = await this.getAsset(ctx, AssetID);
        let lpObj = asset.LP;

        let Asset = parseFloat(lpObj.Asset)
        let USDSH = parseFloat(lpObj.USDSH)
        let k = parseFloat(lpObj.K_Constant)
        
        let payment;
        if(tx_Status == "Buy"){
            let payment = Asset - (k/(USDSH + usdAmount))

            return payment
        }
    
        else{
            let payment = (k/(USDSH - usdAmount)) - Asset 

            return payment
        }
    }



    async getPrice(ctx, assetIDs,singular){



        if(typeof singular === 'string'){
            if(singular == "true"){
                singular = true
            }

            else{
                singular = false
            }
        
        }



        if(singular){
            let asset = await this.getAsset(ctx, assetIDs);
            // let asset2 = await this.getAsset(ctx, "fake");
            // let json4 = {
            //     test:"Emenike100",
            //     key:assetIDs,
            //     functionName:"getPrice",
            //     jsonElement:asset,
            //     jsonELement2:asset2
            // }
    
            //await ctx.stub.putState("sample100", Buffer.from(stringify(json4)));
            let price = parseFloat(asset.LP.USDSH)/parseFloat(asset.LP.Asset)
            return price
        }



        
        assetIDs = JSON.parse(assetIDs);
  
    
        let returnVal = []
        
        for(let i = 0; i < assetIDs.length; i++){

            
            let asset = await this.getAsset(ctx, assetIDs[i]);
            let price = parseFloat(asset.LP.USDSH)/parseFloat(asset.LP.Asset)
            

            returnVal.push({asset:assetIDs[i],price:price})

        
        }


        return returnVal

    }

    async checkAssetBalance(ctx, userID, assetID,amount){
        amount = parseFloat(amount);
        let userBal = await this.getUser(ctx, userID);
        
        if(userBal[assetID].balance < amount){
            return false
        }

        return true
    }


    async inject_eject(ctx,asset,order,LP,asset_LP,user,assetJson){


  
        // order = JSON.parse(order)
        // LP = JSON.parse(LP)
        // asset_LP = JSON.parse(asset_LP)
        // user = JSON.parse(user)
        // assetJson = JSON.parse(assetJson)

        let assetAmount = parseFloat(order.assetAmount)
        let usdshAmount = parseFloat(order.usdshAmount)
        let slippage = parseFloat(order.slippage)
        let inject = order.inject
        let userID = order.userID
        let boost = order.boost


        if(typeof inject === 'string'){
            if(inject == "true"){
                inject = true
            }

            else{
                inject = false
            }
        
        }
        

        if(typeof boost === 'string'){
            if(boost == "true"){
                boost = true
            }

            else{
                boost = false
            }
        
        }



        if(inject){


            if(!(await this.hasBalance(ctx, userID,usdshAmount))){
                return "does not have balance"
            }


            let strikePrice = await this.getPrice(ctx,asset,true)
            strikePrice = strikePrice == null ? 100 : strikePrice;
            // let strikePrice = 100

            
            
            let requestedPrice = assetAmount/usdshAmount
            if(!(requestedPrice <= strikePrice*(1+slippage) && usdshAmount >= requestedPrice/(1+slippage))){
                return "not within range"
            }


            user.USDSH.balance -= usdshAmount;

            

            LP.USDSH += usdshAmount

            if(!boost){

                if(! await this.checkAssetBalance(ctx,userID,asset,assetAmount)){
                    return "not enough of asset"
                }

                // you have to check if they even have

                user[asset].balance -= assetAmount
                LP.Asset += assetAmount 
                


            }

            else{
                assetJson.reserves -= assetAmount
                LP.Asset += assetAmount 
                
            }

            if(asset_LP[userID] == undefined){
                asset_LP[userID] = {
                    Asset:assetAmount,
                    USDSH:usdshAmount
                }
            }

            else{
                asset_LP[userID].Asset += assetAmount
                asset_LP[userID].USDSH += usdshAmount

            }

            }


        else{

            if(asset_LP[userID] == undefined){
                return
            } 
            
            if(asset_LP[userID].Asset < assetAmount || asset_LP[userID].USDSH < usdshAmount){
                return
            }

            LP.Asset -= assetAmount
            LP.USDSH -= usdshAmount



            asset_LP[userID].Asset -= assetAmount
            asset_LP[userID].USDSH -= usdshAmount
            user.USDSH.balance -= usdshAmount

        }

        LP.K_Constant = LP.Asset * LP.USDSH



        return {
            LP:LP,
            assetLP:asset_LP,
            user:user
        }

        
    
    
    }


   



   

    async executeOrder(ctx, assetID, orders){
        let json = {
            test:"EmenikeArinze"
        }

        await ctx.stub.putState("sample1", Buffer.from(stringify(json)));


        let asset = await this.getAsset(ctx, assetID)
        let asset_LP = await this.get(ctx, assetID+"_LP")
        orders = JSON.parse(orders)
        for(let i = 0; i < orders.length; i++){

    
            let userID = orders[i].userID;
            let assetID = orders[i].assetID
            let orderType = orders[i].orderType
            let tokenAmount = parseFloat(orders[i].tokenAmount)
            let strikePrice = parseFloat(orders[i].strikePrice)
            let slippage = parseFloat(orders[i].slippage)
            let txID = orders[i].txID



            let user = await this.getUser(ctx, userID)
            let LP = asset.LP
            


            let orderEvent = {
                UserID:userID,
                Type: "Order",
                txID:txID,
                Transaction:{
                    Type:"Buy",
                    orderID: txID,
                    AssetID: assetID,
                    AssetAmount: tokenAmount,
                    USDSHAmount: "test",
                    StrikePrice: "test",
                    fee: "test",
                    NewPriceOfAsset:"test",
                },
                valid:false
            }


            if(orderType == "Buy"){


                if(tokenAmount >= asset.LP.Asset){
                    let json = {
                        valid:true,
                        reason:"tried to buy all of pool"
                    }
                    await ctx.stub.putState(txID, Buffer.from(stringify(json)));
                    return
                }

                let USDSH_Amount = this.Liquity_Pool_Math(LP, tokenAmount, "Buy", false).amount;

                let oldLP = this.Liquity_Pool_Math(LP, tokenAmount, "Buy", false);

                let oldPrice = oldLP.LP.USDSH/oldLP.LP.Asset
                orderEvent.Transaction.StrikePrice = oldPrice


                let SH_Cut = USDSH_Amount*this.orderFee;
                let newUSDSH_Amount = USDSH_Amount + SH_Cut;
                
                
                if(!(USDSH_Amount <= strikePrice*(1+slippage) && USDSH_Amount >= strikePrice/(1+slippage))){

                    let val = {
                        action: "Order",
                        errorCode: 2
                    }
                    await ctx.stub.putState(txID, Buffer.from(stringify(val)));
                    return
                }
                
                let hasBal = await this.hasBalance(ctx, userID, newUSDSH_Amount)
                if(!hasBal){
                    
                    let val = {
                        action: "Order",
                        errorCode: 3,
                        newUSDSH_Amount:newUSDSH_Amount
                    }
                    await ctx.stub.putState(txID, Buffer.from(stringify(val)));
                    return
                }

                orderEvent.valid = true
            
                let payment = this.Liquity_Pool_Math(LP, tokenAmount, "Buy", true)
                
                let newPrice = payment.LP.USDSH/payment.LP.Asset
                orderEvent.Transaction.NewPriceOfAsset = newPrice
                
                let totalWithdraw = payment.amount + SH_Cut
                orderEvent.Transaction.USDSHAmount = payment.amount
                orderEvent.Transaction.fee = SH_Cut

                asset.LP = payment.LP


                user.USDSH.balance = parseFloat(user.USDSH.balance) - totalWithdraw
                asset.fees = parseFloat(asset.fees) + SH_Cut

                if(user[assetID] == undefined || user[assetID] == null){
                    let asset = {
                        balance: tokenAmount
                    }
                    user[assetID] = asset
            
                }
        
                else{
                    user[assetID].balance = parseFloat(user[assetID].balance) + tokenAmount
                
                }

                this.incrementCollectedFees(SH_Cut)



            }

            else if(orderType == "Sell"){

                
               

                let USDSH_Amount = this.Liquity_Pool_Math(LP, tokenAmount, "Sell", false).amount;
                let SH_Cut = USDSH_Amount*this.orderFee;


                let oldLP = this.Liquity_Pool_Math(LP, tokenAmount, "Buy", false);
                let oldPrice = oldLP.LP.USDSH/oldLP.LP.Asset
                orderEvent.Transaction.StrikePrice = oldPrice


                if(!(USDSH_Amount <= strikePrice*(1+slippage) && USDSH_Amount >= strikePrice/(1+slippage))){
                    let val = {
                        action: "Order",
                        errorCode: 2
                    }
                    await ctx.stub.putState(txID, Buffer.from(stringify(val)));
                    return
                }
                
                orderEvent.valid = true

                let payment = this.Liquity_Pool_Math(LP, tokenAmount, "Sell", true)
                let userPayment = payment.amount - SH_Cut

                let hasAssetBalance = await this.checkAssetBalance(assetID,tokenAmount)

                if(!hasAssetBalance){
                    let val = {
                        action: "Order",
                        errorCode: 2
                    }
                    await ctx.stub.putState(txID, Buffer.from(stringify(val)));
                    return
                }

                
                orderEvent.Transaction.USDSHAmount = payment.amount

                let newPrice = payment.LP.USDSH/payment.LP.Asse
                orderEvent.Transaction.NewPriceOfAsset = newPrice
                
    
                asset.LP = payment.LP
                orderEvent.Transaction.fee = SH_Cut


                user.USDSH.balance = parseFloat(user.USDSH.balance) + userPayment
                asset.fees = parseFloat(asset.fees) + SH_Cut


                let zeroBalance = parseFloat(user[assetID].balance) - tokenAmount
                


                if(zeroBalance <= 0){
                    delete user[assetID]
                
                }
                
                else{
                    user[assetID].balance = zeroBalance
            
                }

                this.incrementCollectedFees(SH_Cut)

            }

            else if(orderType == "InjectEject"){

                //ctx,asset,order,LP,asset_LP,user,assetJson
                
                // return {
                //     assetID:assetID,
                //     orders:orders[i],
                //     LP:LP,
                //     asset_LP:asset_LP,
                //     user:user,
                //     asset:asset
                // }
                let result = await this.inject_eject(ctx, assetID, orders[i], LP, asset_LP, user, asset)
                // return
                // asset_LP = result.assetLP
                // user = result.user
                // asset.LP = result.LP

                // return result
            }
            
           
            await ctx.stub.putState(userID, Buffer.from(stringify(user)));

            await ctx.stub.setEvent('event', Buffer.from(stringify(orderEvent)));
            
            await ctx.stub.putState(txID, Buffer.from(stringify(orderEvent)))


        }
        
        await ctx.stub.putState(assetID, Buffer.from(stringify(asset)));
        await ctx.stub.putState(assetID+"_LP", Buffer.from(stringify(asset_LP)))

    }






}

module.exports = AssetTransfer