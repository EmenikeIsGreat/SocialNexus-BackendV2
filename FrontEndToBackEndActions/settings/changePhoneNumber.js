const axios = require('axios')



const Json = {
    id:'634e06bf2bdbdf13361d940a',
    phoneNumber:"Emenike"
}



async function changePhoneNumber(Json){
    const res = await axios.post('http://localhost:8080/settings/changePhoneNumber',Json)
    console.log(res.data)
}


changePhoneNumber(Json)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()