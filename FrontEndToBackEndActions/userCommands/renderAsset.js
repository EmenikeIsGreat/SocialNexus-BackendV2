
const axios = require('axios')



let id = {id:"62f2fa563471195687a3f0e8"}

async function getAsset(id){
    const res = await axios.post('http://localhost:3000/userProfile/getAsset',id)
    console.log(res.data)
}


getAsset(id)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()

