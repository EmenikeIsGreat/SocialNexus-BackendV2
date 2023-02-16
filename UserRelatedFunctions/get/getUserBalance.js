const query = require('../../Blockchain/wrappedFabConnect/query')


module.exports = async function getUserBalance(id){
    console.log(typeof(id))
    console.log("----------")
    let balance = await query("getBalance", [id])
    //get users portfolio from data base
    //construct a forloop that iterates through the portfolio and update the asset balance with the addition of the deltas
    //set that equal to balance and send it
    console.log(balance.result.balance)
    return balance.result.balance
}

//getUserBalance("63b790f4871e180d114f80c6")

// query( "getUser", ["Emenike"]).then((data)=>{
//   console.log(data)
// })
