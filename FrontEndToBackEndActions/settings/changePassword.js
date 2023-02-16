const axios = require('axios')
const bcrypt = require("bcryptjs")


const Json = {
    id:"634e06bf2bdbdf13361d940a",
    password:"socialnexus1",
    newPassword:"socialnexus1"

}


async function changePassword(Json){
    const res = await axios.post('http://localhost:8080/settings/changePassword',Json)
    console.log(res.data)
}


changePassword(Json)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()


