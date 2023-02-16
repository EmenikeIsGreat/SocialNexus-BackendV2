const mongoose = require("mongoose");
const tx = require('../../schemas/transaction')



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

module.exports = async function getTransaction(jsonInfo){

    let {id, amount, initialRender, date} = jsonInfo
    console.log("gettign userID: " + id)
    amount = parseInt(amount)

    let doesUserExist = await tx.exists({'UserID':id});
    let user = await tx.find({'UserID':id});
    console.log(doesUserExist + " foundStatus")
    //console.log(doesUserExist)
    if(!doesUserExist){
        console.log("THE USER IS NOT FOUND. CANNOT GET TRANSACTIONS")
        return [];
    }


    try{
        console.log("This is the intial render " + initialRender);
        if(initialRender == true){
            let transaction = await tx.find({'UserID':id}).sort({$natural:-1}).limit(amount)
            console.log("trasnaction: " + transaction == 'undefined');
            
           
            let max = false
            if(transaction.length < amount){
                max = true
            }
            let lastDate = () => {
                if(transaction == 'undefined'){
                    return false;
                }
                else{
                    return transaction[transaction.length-1].createdAt
                }

            }
            let output = {
                transactions: transaction,
                lastDate:lastDate(),
                
                max:max
            }
            console.log(output)
            return output
        }
    
        else{
            console.log("initial render is false")
            let nextTransaction = await tx.find({"UserID":id,
            createdAt: {
                $lt: new Date(date)
            }
                }).sort({$natural:-1}).limit(amount)
    

            let lastDate;
        

            let max = false
            if(nextTransaction.length < amount){
                max = true
                lastDate = null
            }

            else{
                lastDate = nextTransaction[nextTransaction.length-1].createdAt
            }
            let output = {
                transactions: nextTransaction,
                lastDate: lastDate,
                max:max
            }

            console.log(output)
            return output
        }
    }

   catch(error){
        //console.log(error)
       return error
       
   }


}

//getTransaction({id: '63b79170871e180d114f80c9',amount: 3,initialRender: false , date: "2023-01-12T03:09:49.423Z"})

async function test1(){
    let order = await tx.find({'UserID':'63b79170871e180d114f80c9'}).sort({$natural:-1}).limit(1)

    console.log(order)
}

//test1()
