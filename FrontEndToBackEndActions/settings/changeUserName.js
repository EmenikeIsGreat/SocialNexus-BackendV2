const axios = require('axios')



const Json = {id:'62c0eadc47ec21fd9e585023', 
userName: 'EmenikeCool100000000000000000'}



async function changeUserName(Json){
    const res = await axios.post('http://localhost:3000/settings/changeUserName',Json)
    console.log(res.data)
}



//changeUserName(Json)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()



async function settingsRequest(command, payload){
    const res = await axios.post('http://localhost:5000/settings/test',payload)
    //console.log(process.env.ROUTE_BASE_URL)
}
//settingsRequest('test',"hello BRO")