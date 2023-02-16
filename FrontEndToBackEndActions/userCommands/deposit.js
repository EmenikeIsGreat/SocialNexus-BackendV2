
const axios = require('axios')



let json = {id:"Emenike",amount:"1000000000",withdraw:true}

async function deposit(){
    const res = await axios.post('http://localhost:8080/processOrder/ExternalAccountTransaction',json)
    console.log(res.data)
}


//deposit(json)

