const { response } = require('express');
var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-Helpers')

router.get('/', function(req, res, next) {
  producthelpers.getAllProducts().then((products)=>{
    let user=req.session.user
    console.log(user)
   res.render('user/view-products',{admin:false,products,user})
  })
});
router.get('/login',(req,res)=>{
  res.render('user/login')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.dosignup(req.body).then((response)=>{
    console.log(response)
  })
})
router.post('/login',(req,res)=>{
  userHelpers.dologin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }
    else{
      res.redirect('/login')
    }
  })
  })
  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
  })




module.exports = router;
