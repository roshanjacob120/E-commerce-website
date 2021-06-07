var db = require("../config/connection");
const collection = require("../config/collection");
const userHelpers=require('../helpers/product-helpers')
const bcrypt=require('bcrypt');
 module.exports={
    dosignup:(userData)=>{
     return new Promise(async(resolve,reject)=>{
         userData.Password=await bcrypt.hash(userData.Password,10)
         db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then((data)=>{
            resolve(data.ops[0])
         })
        
     })
    },
    dologin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
         let user=await db.get().collection(collection.USER_COLLECTIONS).findOne({Email:userData.Email})
         if(user)
         { 
               bcrypt.compare(userData.Password,user.Password).then((status)=>{
               if(status)
               {
                   console.log('Login success')
                   response.user=user
                   response.status=true
                   resolve(response)
               }
               else{
                   console.log("Login failed")
                   resolve({status:false})
               }
               })
            }
         else
         {
             console.log("Login failed")
             resolve({status:false})
         }
        })
    }

}