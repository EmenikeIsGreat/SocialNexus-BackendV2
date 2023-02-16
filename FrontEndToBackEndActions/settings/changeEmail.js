const axios = require('axios')



const Json = {
    id:'62c0eadc47ec21fd9e585023',
    email:"yourMom@gmail.com"
}



async function changeEmail(nameJson){
    const res = await axios.post('http://localhost:3000/settings/changeEmail',Json)
    console.log(res.data)
}


//changeEmail(Json)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()