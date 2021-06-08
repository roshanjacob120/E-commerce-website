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

module.exports = router;
