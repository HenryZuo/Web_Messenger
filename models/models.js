var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
})

var contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

var messageSchema = new mongoose.Schema({
  created: {
    type: Date,
    required: true
  },
  content: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    type: mongoose.Schema.ObjectId,
    ref: 'Contact',
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  status: String,
  from: String
})

// Step 2: Create all of your models here, as properties.

var User = mongoose.model('User', userSchema);
var Contact = mongoose.model('Contact',contactSchema);
var Message = mongoose.model('Message',messageSchema);

// Step 3: Export your models object
module.exports = {
  User: User,
  Contact: Contact,
  Message: Message
};
