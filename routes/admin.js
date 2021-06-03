var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"Iphone 11",
      category:"mobile",
      description:"this is a good phone",
      image:"data:image/jpeg;base64,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"
,
    },
    {
      name:"Realme xt",
      category:"mobile",
      description:"this is a good phone",
      image:"data:image/jpeg;base64,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"
,
    },
    {
      name:"Vivo v21",
      category:"mobile",
      description:"this is a good phone",
      image:"data:image/jpeg;base64,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"
    },
    {
      name:"Samsung A50",
      category:"mobile",
      description:"this is a good phone",
      image:"data:image/jpeg;base64,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"
,
    }
  ]
  res.render('admin/view-products',{admin:true,products})
});
router.get('/add-products',function(req,res)
{
  res.render('admin/add-products')
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

module.exports = router;