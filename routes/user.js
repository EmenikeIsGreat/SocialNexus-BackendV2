
const express = require('express')

const stringify =  require('json-stringify-deterministic')

const getUserBalance = require('../UserRelatedFunctions/get/getUserBalance')
const changeBio = require('../UserRelatedFunctions/settings/changeBio')
const getTx = require('../UserRelatedFunctions/get/getTx')
const getAsset = require('../AssetFunctions/getAsset')
const followUnfollow = require('../UserRelatedFunctions/profileCommands/followUnfollow')
const getUser = require('../UserRelatedFunctions/createOrRenderUser/renderClient')
const multer  = require('multer');
const upload = multer({ dest: 'uploads/'});
const changePhoto = require('../UserRelatedFunctions/profileCommands/changePhoto')
const {deletePhoto} = require('../UserRelatedFunctions/profileCommands/deletePhoto')
const searchUser = require('../full-text-search/get')
const getPortfolioInvestments = require('../UserRelatedFunctions/get/getPortfolioInvestments')
const userSchema = require('../schemas/User')
const getMessages = require("../UserRelatedFunctions/get/getMessage") 
const router = express.Router()





router.get('/getUserBalance', (req, res) =>{

    let {id} = req.query

    
    let resValue = getUserBalance(id).then((data)=>res.send(data))
    .catch((error)=>res.send(error))
    //res.end()


    // testing
    // res.send(req.body)
    // res.end()
})

router.post('/changeBio', async (req, res) =>{

    let jsonInfo = req.body
    
    console.log(jsonInfo)
  
    let resValue = await changeBio(jsonInfo);
    console.log(resValue)
    res.send(resValue)
    res.end()
})




router.get('/getAsset', async (req, res) =>{
    console.log("running get asset commmand")
    let {asset} = req.query

    let resValue = await getAsset(asset)
    res.send(resValue);

})


router.post('/followUnfollow', async (req, res) =>{

    let {status,fromID,toID} = req.body
    let resValue = await followUnfollow(status,fromID,toID)

    console.log(resValue)
    res.send(resValue)
    res.end()
})


router.get('/getUser', async(req, res) =>{
    let input = {id:req.query.user,self:false,nonSelfID:req.query.nonSelfID}
    let response = await getUser(input)
    res.send(response)
})


router.get('/deletePhoto', async (req, res) =>{
    console.log(req.query.id)
    let user = await userSchema.findById(req.query.id)


    if(user.hasProfilePic){
        console.log("has photo")
        await deletePhoto(req.query.id)
        user.hasProfilePic = false;
        await user.save();
        res.send({
            hadPhoto:true,
            removedPhoto:true
        })
        res.end()
    }

    else{
        res.send({
            hadPhoto:false,
            removedPhoto:false
        })

        res.end()
    }


})


router.post('/changePhoto', upload.single('profile'), async (req, res) =>{
    console.log("changing photo")
    
    console.log("this is the ID 2" + req.query.id)


    const title = req.body.title;

    const file = req.file;  
    
    
    let response = await changePhoto(file, req.query.id)
    
    res.send(response)
    res.end();
})



router.get('/search', async (req, res) =>{


    const {id,input} = req.query
    console.log(id, input)

    const response = await searchUser(id,input)
    
    
    res.send(response)

    })

router.get('/portfolioInvestments', async (req, res) =>{

    const {id,renderAll} = req.query

    let response = await getPortfolioInvestments({id:id, renderAll:renderAll})

    res.send(response)

    
})


router.get('/getMessages',async (req,res)=>{
    console.log("check 1 " + stringify(req.query))
    req.query.initialRender = false;
    let response = await getMessages(req.query);
    console.log("---------------")
    console.log(response)
    res.send(response);
})

router.get('/getTx', async (req, res) =>{

    console.log("check 1 " + stringify(req.query))
    let response = await getTx(req.query);
    console.log("------------------------------Sending these trasnactions------------------------")
    console.log(response)
    res.send(response);

})







module.exports = router


