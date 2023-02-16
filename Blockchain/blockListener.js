/*

this scans the block chain to see when a new block is created


*/



const chainInfo = require('./wrappedFabConnect/chainInfo')
const axios = require('axios')

const path = require('path');

const coolPath = path.join(__dirname, '../.env')
require("dotenv").config({path:coolPath})

//chainInfo("Emenike")


//old block


let oldBlock;



// checks when new block is created
async function checkForNewBlock(){
    let value = await chainInfo()

    if(value != oldBlock){
        console.log("new block has been created: block " + value )
        oldBlock = value
        await empty()
    }
        oldBlock = value
        console.log(value)

}

// sends command to the server to send all orders to the blockchain
async function empty(){


    // aws server = 'http://'+process.env.MAIN_SERVER_IP
    const res = await axios.post('http://localhost:8080/processOrder/empty', {
                    permissionToEmpty:true
              })
    console.log(res.data)
}



// calls x number of seconds to see when new block is created
setInterval(async ()=>{ 
    await checkForNewBlock()
}, 1000);
