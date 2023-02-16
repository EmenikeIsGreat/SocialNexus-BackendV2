
const axios = require('axios')



let user = {type:"user", input:"OK"}
let asset = {type:"asset", input:"conv"}

async function searchUser(id){
    const res = await axios.get('http://localhost:5000/userProfile/search', {params:asset})
    console.log(res.data)
}


searchUser(asset)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()

