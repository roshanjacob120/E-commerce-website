var db = require("../config/connection");
const collection = require("../config/collection");
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
    }
}