const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Path = require('path');


id = "WhateverNike"



function encode(data){
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64
  }

async function getPhotos(id){

    try {
  
      
  
      const resp = await axios.get('http://localhost:8080/userProfile/getPhoto'+id);
  
  
      
      if (resp.status === 200) {
      //console.log(resp.data)
     
      console.log(encode(resp.data));
      return encode(resp.data)

      } 
      } 
    catch(err) {
      console.log(err.message)
      return err.messagen
      }
  
  
  
  }
  

getPhotos(id);







