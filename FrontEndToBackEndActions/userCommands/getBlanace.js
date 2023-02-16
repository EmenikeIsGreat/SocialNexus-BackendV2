
const axios = require('axios')



let id = {id:"Emenike"}

async function getBalance(id){
    const res = await axios.post('http://localhost:3000/userProfile/getUserBalance',id)
    console.log(res.data)
}


getBalance(id)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()

