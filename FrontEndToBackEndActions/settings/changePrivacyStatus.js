const axios = require('axios')


   
const Json = {
    id:'634f26d4b772772dbd909d93',
    privacyStatus:false
}



async function changePrivacyStatus(Json){
    const res = await axios.post('http://localhost:8080/settings/changePrivacyStatus',Json)
    console.log(res.data)
}


//changePrivacyStatus(Json)

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()