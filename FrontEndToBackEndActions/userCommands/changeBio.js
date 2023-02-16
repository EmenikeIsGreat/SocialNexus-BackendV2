
const axios = require('axios')


let jsonInfo = {id:'62f7fdd597c2ceea6ad4595c', newBio:'did it work'}

async function changeBio(jsonInfo){
    const res = await axios.post('http://localhost:3000/userProfile/changeBio',jsonInfo)
    console.log(res.data)
}


changeBio(jsonInfo)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()
