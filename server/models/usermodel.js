const mongoose = require('mongoose')

const User = new mongoose.Schema({
    firstname: { 
        type: String, 
        required: true,
        message: 'Firstname is requiered',
       },
    lastname: { 
        type: String, 
        required: true,
        message: 'Lastname is required'
    },
    email: {
      type: String, 
      required: true, 
      unique: true,
      dropDups: true,
      message: 'Email is requiered' 
    },
    username: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      message: 'Username is required'
    },
    password: { 
        type: String, 
        required: true,
        message: 'Password is requiered',
      },
      interests:[],
      age:{ type: Number},
      date:{
        type: Date,
        default: Date.now().toString()
      },

    },
      {timestamps: true},{collection: 'users'});

  const userModule = mongoose.model('users', User);
  
  module.exports = userModule