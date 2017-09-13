var express = require('express');

var models = require('../models/models');
var User = models.User;
var Contact = models.Contact;
var Message = models.Message;


var router = express.Router();

//twilio
var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
var fromNumber = process.env.MY_TWILIO_NUMBER; // Your custom Twilio number
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

/* GET home page. */
// router.get('/',function(req,res){
//   res.redirect('/contacts');
// })

router.get('/contacts', function(req, res, next) {
  Contact.find({owner: req.user._id}).exec(function(err,contacts){
    res.render('contacts',{
      contacts: contacts
    });
  });
});

router.get('/contacts/new',function(req,res){
  res.render('editContact',{
    name: '',
    phone: ''
  });
})

router.get('/contacts/:contactID',function(req,res){
  Contact.findById(req.params.contactID).exec(function(err,contact){
    res.render('editContact',{
      name: contact.name,
      phone: contact.phone
    });
  })
})

router.post('/contacts/new',function(req,res){
  var c = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    owner: req.user._id
  })
  c.save(function(err){
    if(err){res.send(err)}
    else{
      res.redirect('/contacts')
    }
  })
})

router.post('/contacts/:contactID',function(req,res){
  Contact.findByIdAndUpdate(req.params.contactID,{
    name: req.body.name,
    phone: req.body.phone
  }).exec(function(err,contact){
    res.redirect('/contacts')
  })
})

router.get('/messages',function(req,res){
  Message.find({$or:[{'user': req.user._id},{'contact': req.user._id},{'from': '+1'+req.user.phone}]})
  .sort({created: -1})
  .populate('contact')
  .exec(function(err,messages){
    res.render('messages',{
      messages: messages
    });
  })
})

router.get('/messages/:contactId',function(req,res){
  Message.find({$or:[{'user': req.user._id,'contact': req.params.contactId},{'user': req.params.contactId,'contact': req.user._id},{'from': req.user._id,'contact': req.user._id},{'from': req.user._id,'contact': req.user._id}]})
  .sort({created: -1})
  .populate('contact')
  .exec(function(err,messages){
    res.render('messages',{messages: messages});
  })
})

router.get('/messages/send/:contactId',function(req,res){
  Contact.findById(req.params.contactId).exec(function(err,c){
    res.render('newMessage',{
      contact: c.name
    })
  })
})

router.post('/messages/send/:contactId',function(req,res){
  Contact.findById(req.params.contactId).exec(function(err,c){
    var data = {
    body: req.body.message,
    to: '+1' + c.phone, // a 10-digit number
    from: fromNumber
    };
    client.messages.create(data, function(err, msg) {
      // save our Message object and redirect the user here
      var m = new Message({
        created: new Date(),
        content: req.body.message,
        user: req.user._id,
        contact: c._id,
        channel: "SMS",
        from: '+14243733263',
        status: "sent"
      })
      m.save(function(err){
        res.redirect('/messages/'+c._id)
      })
    });
  });
})

router.post('/messages/receive',function(req,res){
  User.findOne({phone: req.body.From.substring(2)}).exec(function(err,u){
    Contact.findOne({phone: req.body.To.substring(2)}).exec(function(err,c){
      var m = new Message({
        created: new Date(),
        content: req.body.Body,
        user: u._id,
        contact: c._id,
        channel: "SMS",
        from: req.body.From,
        status: "received"
      })
      m.save(function(err){
        res.end();
      })
    })
  })
})



module.exports = router;
