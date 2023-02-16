

// this function allows user to get conversion of the amount of an asset they would get back
//EX: 1 SN coin => 100 LoganPaulCoins

const query = require('../Blockchain/wrappedFabConnect/query')

module.exports = async function TestLP(assetID, txStatus, amount){
    let response = await query('test_LP_Math',[assetID,amount,txStatus,'false'])
    response = response.result
    console.log(response)
    return response.payment
}



//TestLP("fake","Buy","9")

//conversion("fake","Sell","2")