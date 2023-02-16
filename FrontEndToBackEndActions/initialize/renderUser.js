
const axios = require('axios')



let jsonInfo = {id:'62f7fdd597c2ceea6ad4595c'}

async function renderUser(jsonInfo){
    const res = await axios.post('http://localhost:3000/renderUser',jsonInfo)
    console.log(res.data)
}


//renderUser(jsonInfo)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()


async function test(){
    const res = await axios.get('https://hot-news-buy-64-92-84-99.loca.lt/response')
    console.log(res)
}

test()
