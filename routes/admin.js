var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
 producthelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products',{admin:true,products})
 })
 
});
router.get('/add-products',function(req,res)
{
  res.render('admin/add-products',{admin:true})
})
router.post('/add-products',function(req,res){
  producthelpers.addproduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.png',(err,done)=>{
      if(!err){
        res.render("admin/add-products")
      }
      else{
        console.log(err)
      }
    })
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  producthelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })

})
router.get('/edit-products/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId)
  producthelpers.getProduct(proId).then((product)=>{
    res.render("admin/edit-products",{product})
  })
 
})
router.post('/edit-products/:id',(req,res)=>{
     console.log(req.params.id)
     producthelpers.updateProduct(req.params.id,req.body).then(()=>{
       res.redirect('/admin')
       if(req.files.Image)
       {
         let image=req.files.Image
         image.mv('./public/product-images/'+req.params.id+'.png')
       }
     })
})

module.exports = router;
