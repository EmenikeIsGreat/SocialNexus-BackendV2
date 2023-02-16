
const axios = require('axios')


let json = {id:"63b349f21aa5830d1301421e",amount:2,initialRender:true,date:"2023-01-03T03:55:19.597Z"}

async function getTx(json){
    const res = await axios.get('http://localhost:8080/user/getMessages',{params:json})
    console.log(res.data)
}


//getTx(json)


let json2 = {id: '62b750b69e2542d58f9721c6',amount: 2,intialRender: true,date: "2022-07-02T17:12:54.407Z"}

async function getTx(json2){
    const res = await axios.get('http://localhost:8080/user/getTx',{params:json2})
    console.log(res.data)
}


getTx(json2)

async function test(){
    const res = await axios.get('http://localhost:8080/test')
    console.log(res)
}

//test()
