const { response } = require('express');
var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-Helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn)
  {
     next()
  }
  else
  {
    res.redirect('/login')
  }
}

router.get('/', function(req, res, next) {
  producthelpers.getAllProducts().then((products)=>{
    let user=req.session.user
    console.log(user)
   res.render('user/view-products',{admin:false,products,user})
  })
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn)
  {
  res.redirect('/')
  }
  else
    res.render('user/login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
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
      req.session.loginErr="Invalid Username or Password"
      res.redirect('/login')
    }
  })
  })
  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
  })
  router.get('/cart',verifyLogin,(req,res)=>{
    res.render('user/cart')
  })




module.exports = router;
