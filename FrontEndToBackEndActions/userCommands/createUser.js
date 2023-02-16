const axios = require('axios')
const bcrypt = require("bcryptjs")


const userJson = {
    userName:"f",
    name:"r",
    phoneNumber:"deg",
    email:"geg",
    password:"heg"
}





async function createUser(userJson){
    console.log("Emenike")
    const res = await axios.post('http://44.203.95.162:8080/createUser',userJson)
    console.log(res.data)
}

//createUser(userJson);


//createUser(userJson)

async function test(){
    const res = await axios.post('http://34.226.249.233:8080/createUser',userJson)
    console.log(res.data)
}

//test()


