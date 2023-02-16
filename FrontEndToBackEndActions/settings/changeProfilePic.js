const axios = require('axios')



async function changeProfilePic(payload){
    const res = await axios.post('http://localhost:8080/userProfile/changeProfilePic',payload)
    //console.log(process.env.ROUTE_BASE_URL)
}
settingsRequest()