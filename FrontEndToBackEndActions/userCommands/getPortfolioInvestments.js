
const axios = require('axios')



let request = {id:"Emenike", renderAll:true}


async function getPortfolioInvestments(request){
    const res = await axios.get('http://localhost:5000/userProfile/portfolioInvestments', {params:request})
    console.log(res.data)
}


//getPortfolioInvestments(request)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()

