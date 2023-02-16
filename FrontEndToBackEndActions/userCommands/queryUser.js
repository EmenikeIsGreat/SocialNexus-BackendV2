
const axios = require('axios')



let id = "63b79170871e180d114f80c9"

async function getUser(id){
    const res = await axios.get('http://localhost:8080/user/getUser',{params:{user:id}})
    console.log(res.data)
}


getUser(id)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()

