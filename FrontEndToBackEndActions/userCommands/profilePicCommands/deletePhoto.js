const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Path = require('path');


id = "Whatever"

async function deletePhotos(id){

    try {
  
      
  
      const resp = await axios.post('http://localhost:5000/userProfile/deletetPhoto'+id);
  
  
      
      if (resp.status === 200) {
      console.log(resp.data)
     
      return resp.data;

      } 
      } 
    catch(err) {
      console.log(err.message)
      return err.message
      }
  
  
  
  }
  

//deletePhotos(id)