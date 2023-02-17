const express = require('express')
const bodyParser = require('body-parser')
const createUser = require('../UserRelatedFunctions/createOrRenderUser/createUser')
const bcrypt = require("bcryptjs")

const settingsRouter = require('./settings')
const userProfileRouter = require('./user')
const processOrder = require('./transaction')
const renderUser = require('../UserRelatedFunctions/createOrRenderUser/renderClient')
const user = require('../schemas/User')
const passwordCollection = require('../schemas/passwords')
const stringify = require('json-stringify-deterministic');


const app = express()

app.use(bodyParser.json())


app.use('/settings', settingsRouter)
app.use('/user', userProfileRouter)
app.use('/processOrder', processOrder)


app.post('/createUser', async (req, res) =>{

    let userJson = req.body
    let result = await createUser(userJson);
    console.log("----------------")
    console.log("result is " + stringify(result))
    console.log("----------------")

    res.json(result);
    res.end();


    // testing
    // res.send(req.body)
})


app.post('/signIn', async (req, res) =>{
    
    
    let {email, password} = req.body

    console.log("executing sign In")
    console.log(req.body)

    let potentialUser = await user.findOne({email:email})
    if(potentialUser == null){
        console.log("did not find user")
        res.send({valid:false})
        return
    }
    console.log(potentialUser)


    let userID = potentialUser.id;
    
    let encryptedUsers = await passwordCollection.findOne({user:userID})

    encryptedUsers = encryptedUsers.encryptedPassword
    
    
    
    bcrypt.compare(password, encryptedUsers, async function(error, isMatch) {
        if (error) {
            console.log(error);
            throw error
        } 
        
        else if (!isMatch) {
            console.log("does not matched")
            res.send({valid:false})
        } 
        
        else {
            console.log('matched')
            // change false to true when in production
            res.send(await renderUser({id:userID,self:true}))
        }
    })

})


let routePort = 8080;


app.listen(routePort, ()=>{
    console.log('listening on port: ' + routePort)
})



















