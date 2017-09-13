var express = require('express');
var models = require('../models/models');
var User = models.User;
var router = express.Router();

module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE

  router.get('/',function(req,res){
    if(!req.user){
      res.redirect('/login')
    }
    else{
        res.redirect('/contacts')
    }
  })

  router.get('/signup',function(req,res){
    res.render('signup');
  })

  router.get('/login',function(req,res){
    if(req.user){
      res.redirect('/contacts');
    }
    else{res.render('login');}
  })

  router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/login');
  })

  router.post('/signup',function(req,res){
    if(req.body.username && req.body.password && req.body.phone && (req.body.password === req.body.passwordRepeat)){
      var u = new User({
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone
      })
      u.save(function(err){
        if(err){res.send(err)}
        else{
          res.redirect('/login')
        }
      })
    }
  });

  router.post('/login',passport.authenticate('local'),function(req,res){
    res.redirect('/');
  })


  router.use('/',function(req,res,next){
    if(!req.user){
      res.redirect('/login')
    }
    next();
  })

  return router;
}
