const axios = require('axios')



const nameJson = {
    id:'634592c92ef1440c9a4f9452',
    firstName:"Joe",
    lastName:"Shiesty"
}



async function changeName(nameJson){
    const res = await axios.post('http://localhost:8080/settings/changeName',nameJson)
    console.log(res.data)
}


changeName(nameJson)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()