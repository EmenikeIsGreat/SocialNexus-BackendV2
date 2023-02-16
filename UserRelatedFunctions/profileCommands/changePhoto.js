require('dotenv').config()
const path = require('path');

const mongoose = require("mongoose");

const coolPath = path.join(__dirname, '../../.env')
require("dotenv").config({path:coolPath})

console.log(coolPath)
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const User = require('../../schemas/User')
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log("connected")
})
  .catch((error)=>{
      console.log(error);

  })


// // uploads a file to s3
// function changePhoto(file, credentials) {

//     const {bucketName, region, accessKeyId, secretAccessKey} = credentials
//     console.log(credentials)

//     const s3 = new S3({
//         region,
//         accessKeyId,
//         secretAccessKey
//       })

//     const fileStream = fs.createReadStream(file.path)

//     console.log("bucket name is " + bucketName)

//     const uploadParams = {
//         Bucket: bucketName,
//         Body: fileStream,
//         Key: file.filename
//     }

//     return s3.upload(uploadParams).promise()
// }
// exports.changePhoto = changePhoto


// // downloads a file from s3
// function getFileStream(fileKey) {
//   const downloadParams = {
//     Key: fileKey,
//     Bucket: bucketName
//   }

//   return s3.getObject(downloadParams).createReadStream()
// }
// exports.getFileStream = getFileStream


// const bucketName = process.env.AWS_BUCKET_NAME
// const region = process.env.AWS_BUCKET_REGION
// const accessKeyId = process.env.AWS_ACCESS_KEY
// const secretAccessKey = process.env.AWS_SECRET_KEY

// let credentials = {
//     bucketName: bucketName,
//     region:region,
//     accessKeyId: accessKeyId,
//     secretAccessKey:secretAccessKey
// }

// console.log(credentials)


// const s3 = new S3({
//   region,
//   accessKeyId,
//   secretAccessKey
// })

// // uploads a file to s3
// function uploadFile(file) {
//   const fileStream = fs.createReadStream(file.path)

//   const uploadParams = {
//     Bucket: bucketName,
//     Body: fileStream,
//     Key: file.filename
//   }

//   return s3.upload(uploadParams).promise()
// }

//uploadFile()




const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
module.exports = async function changePhoto(file,id) {
  const fileStream = fs.createReadStream(file.path)
  let user = await User.findById(id)
  user.hasProfilePic = true;
  let response = await user.save();
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: id
  }

  return s3.upload(uploadParams).promise()
}


//changePhoto("63b349f21aa5830d1301421e")

