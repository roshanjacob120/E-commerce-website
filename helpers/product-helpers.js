var db = require("../config/connection");
const collection = require("../config/collection");
var objectId=require('mongodb').ObjectID;
module.exports={
    addproduct:(product,callback)=>{
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.ops[0]._id)
        }) 
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS).removeOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })

    })
},
    getProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({_id:objectId(proId)},{
                $set:{
                Name:proDetails.Name,
                Description:proDetails.Description,
                Price:proDetails.Price,
                Category:proDetails.Category
            } 
        }).then((response)=>{
            resolve()
        })
        })
    }
}
