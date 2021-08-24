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

router.get('/',async function(req, res, next) {
  let user=req.session.user
  let cartCount=null
  if(req.session.user)
  {
 cartCount=await userHelpers.getcartCount(req.session.user._id)
  }
  producthelpers.getAllProducts().then((products)=>{
    
   res.render('user/view-products',{admin:false,products,user,cartCount})
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
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')
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
  router.get('/cart',verifyLogin,async(req,res)=>{
     let products=await userHelpers.getCartProducts(req.session.user._id)
     console.log(products)
    res.render('user/cart',{products,user:req.session.user})
  })
  router.get('/add-to-cart/:id',(req,res)=>{
    
    userHelpers.addToCart(req.params.id,req.session.user._id).then(() =>{
      res.json({status:true})
    })
      
   
  })




module.exports = router;
