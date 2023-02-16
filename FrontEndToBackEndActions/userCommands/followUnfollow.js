
const axios = require('axios')



let jsonInfo = {status: 'follow',fromID: '62f67c52c7ef61f24b5b1888',toID:'62f68a6150693c2e9d6bb4bd'}

module.exports = async function followUnfollow(status,fromID,toID){
    const res = await axios.post('http://localhost:8080/user/followUnfollow',{
        status:status,
        fromID:fromID,
        toID:toID
    })

}

async function test(){
    const res = await axios.get('http://localhost:3000/test')
    console.log(res)
}

//test()

