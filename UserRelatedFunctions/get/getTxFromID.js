const query = require('../../Blockchain/wrappedFabConnect/query')


module.exports = async function getTxFromID(id){
    
    let value = await query("get", [id])
    
    return value.result


}
//getTxFromID("faketransid")