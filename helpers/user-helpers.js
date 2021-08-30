var db = require("../config/connection");

var objectId=require('mongodb').ObjectID;
const collection = require("../config/collection");
const userHelpers=require('../helpers/product-helpers')
const bcrypt=require('bcrypt');
const { ObjectID } = require("mongodb");
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
    },
addToCart:(proId,userId)=>{
    let proObj={
        item:objectId(proId),
        quantity:1
    }
    return new Promise(async(resolve, reject)=>{
        let usercart= await db.get().collection(collection.CART_COLLECTIONS).findOne({user:objectId(userId)})
        if(usercart){
            let proExist=usercart.products.findIndex(product=> product.item==proId)
            if(proExist!=-1){
                db.get().collection(collection.CART_COLLECTIONS)
                .updateOne({user:objectId(userId),'products.item':objectId(proId)},
                {
                    $inc:{'products.$.quantity':1}
                }).then(() =>{
                    resolve()
                })
            }
            else
            {
           db.get().collection(collection.CART_COLLECTIONS)
           .updateOne({user:objectId(userId)},
           {
               $push:{products:proObj}

            }).then((response)=>{
               resolve()
            }
           )}
        } 
        else
        {
            let cartObj={
                user:objectId(userId),
                products:[proObj]
            }
            db.get().collection(collection.CART_COLLECTIONS).insertOne(cartObj).then((response)=>{
                resolve()
            })
            
        }
    })
},
       getCartProducts:(userId)=>{
           return new Promise(async(resolve, reject)=>{
               let cartItems=await db.get().collection(collection.CART_COLLECTIONS).aggregate([
                   { 
                       $match:{user:objectId(userId)}
                   },
                   {
                       $unwind:'$products'
                   },
                   {
                       $project:{
                           item:'$products.item',
                           quantity:'$products.quantity'
                       }
                   },
                   {
                       $lookup:{
                           from:collection.PRODUCT_COLLECTIONS,
                           localField:'item',
                           foreignField:'_id',
                           as:'product'
                       }
                    },
                    {
                        $project:{
                            item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                        }
                    }
            ]).toArray()
            resolve(cartItems);
        })
    },
    getcartCount:(userId)=>{
              return new Promise(async(resolve,reject)=>{
                  let count=0
                  let cart=await db.get().collection(collection.CART_COLLECTIONS).findOne({user:objectId(userId)})
                  if(cart){
                      count=cart.products.length
                  } 
                  resolve(count)
    }

                       
   )},
   changeProductQuantity:(details)=>{
       details.count=parseInt(details.count)
       details.quantity=parseInt(details.quantity)
       return new Promise((resolve,reject)=>{
           if(details.quantity==1 && details.count==-1)
           {
            db.get().collection(collection.CART_COLLECTIONS)
            .updateOne({_id:objectId(details.cart)},
            {
                $pull:{products:{item:objectId(details.product)}}
            }).then((response) =>{
                resolve({removeProduct:true})
            })
           }
           else
           {
        db.get().collection(collection.CART_COLLECTIONS)
        .updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
        {
            $inc:{'products.$.quantity':details.count}
        }).then(() =>{
            resolve({status:true})
        })
    }
       })
   },
   getTotalAmount:(userId)=>{
    return new Promise(async(resolve, reject)=>{
        let total=await db.get().collection(collection.CART_COLLECTIONS).aggregate([
            { 
                $match:{user:objectId(userId)}
            },
            {
                $unwind:'$products'
            },
            {
                $project:{
                    item:'$products.item',
                    quantity:'$products.quantity'
                }
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTIONS,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
             },
             {
                 $project:{
                     item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                 }
             },
             {
                 $group:{
                     _id:null,
                     total:{$sum:{$multiply:[{$toInt:'$quantity'},{$toInt:'$product.Price'}]}}
                 }
             }
     ]).toArray()
     resolve(total[0].total);
 })
   },
   placeOrder:(order,products,total)=>{
       return new Promise(async(resolve, reject)=>{
           console.log(order,products,total)
           let status =order['payment-method']==='COD'?'Placed':'pending'
           let orderObj={
               deliveryDetails:{
                   mobile:order.mobile,
                   address:order.address,
                   pincode:order.pincode
               }, 
               userId:objectId(order.userId),
               paymentMethod:order['payment-method'],
               products:products,
               totalAmount:total,
               status:status,
               date:new Date()

           }
           db.get().collection(collection.ORDER_COLLECTIONS).insertOne(orderObj).then((response)=>{
               db.get().collection(collection.CART_COLLECTIONS).removeOne({user:objectId(order.userId)})
               resolve()
           })
       })
   },
   getCartProductList:(userId)=>{
       return new Promise(async(resolve, reject)=>{
           let cart=await db.get().collection(collection.CART_COLLECTIONS).findOne({user:objectId(userId)})
           resolve(cart.products)
       })
   },
   getUserOrders:(userId)=>{
       return new Promise(async(resolve, reject)=>{
           console.log(userId)
           let orders=await db.get().collection(collection.ORDER_COLLECTIONS)
           .find({userId:objectId(userId)}).toArray()
           resolve(orders)
       })
   },
   getOrderProducts:(orderId)=>{
    return new Promise(async(resolve, reject)=>{
        let orderItems=await db.get().collection(collection.ORDER_COLLECTIONS).aggregate([
            { 
                $match:{_id:objectId(orderId)}
            },
            {
                $unwind:'$products'
            },
            {
                $project:{
                    item:'$products.item',
                    quantity:'$products.quantity'
                }
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTIONS,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
             },
             {
                 $project:{
                     item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                 }
             }
             
     ]).toArray()
     resolve(orderItems);
 })
   }
}                                                                                                                                   



