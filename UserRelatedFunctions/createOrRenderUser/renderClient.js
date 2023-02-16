const mongoose = require("mongoose");
const User = require('../../schemas/User')

//get portfolio
const getBalance = require('../get/getUserBalance')
const getNotifications = require('../get/getMessage')
const getTx = require('../get/getTx')
const getUsersPortfolioorandBalance = require('../get/getPortfolioInvestments')



  
module.exports = async function renderUser(jsonInfo){
    console.log(jsonInfo)
    console.log('---------------')
    let {id,self,nonSelfID} = jsonInfo
    try{

        let renderSpecifications = {id:id, amount:10, initialRender:true, date: null}

        
        console.log(id)
        let user = await User.findById(id)




        const notifications = self ? await getNotifications(renderSpecifications):null
        const transactions = self ? await getTx(renderSpecifications):null

        //console.log(transactions);
        let portfolioInvestments;
        if(self == false){
            portfolioInvestments = user.privacy ? null:await getUsersPortfolioorandBalance(id)
        }
        else{
            portfolioInvestments = await getUsersPortfolioorandBalance(id)
        }
        
        const balance = self ? await getBalance(id):null

        let returnVal = {
            user:user,
            balance:balance,
            notifications: notifications,
            transactions:transactions,
            valid:true,
            portfolio: portfolioInvestments,

        }

        return returnVal;
    }

   catch(error){
       console.log(error)
       return error
   }


}
//renderUser({id:'63bf13f5f8086e6fe2c9d2b6',self:false})

