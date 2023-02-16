
const axios = require('axios')



let user = {email:"3onvoernvoejrnvljer3", password:'3four3hfoi34rnfo4r'}

async function signIn(user){
    const res = await axios.post('http://localhost:8080/signIn',user)
    console.log(res.data)
}


signIn(user)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()

