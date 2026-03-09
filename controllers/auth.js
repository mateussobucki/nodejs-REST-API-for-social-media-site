const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const err = new Error('Validation failed');
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  };
  const email = req.body.email;
  const password = req.body.password
  const name = req.body.name;

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name
     });
    await user.save()
    
    res.status(201).json({
      msg: 'User created successfully',
      userId: result._id
    })
  }
  catch(err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({email: email})
    if(!user){
      const err = new Error('Email not found');
      err.statusCode = 401;
      throw err;
    }
    
    const isEqual = await bcrypt.compare(password, user.password);
    if(!isEqual){
      const err = new Error('Incorrect password');
      err.statusCode = 401;
      throw err;
    }
    const token = jwt.sign({
      email: user.email, 
      userId: user._id.toString()
    }, 
    `${process.env.JWT_SECRET}`, 
    {expiresIn: '1h'});
          
    res.status(200).json({
      token: token,
      userId: user._id.toString()
    });
  }

  catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if(!user){
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      msg: 'Status fetched successfully',
      status: user.status
    })
  }
  catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    };
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const newStatus = req.body.status
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const err = new Error('Validation failed');
    err.statusCode = 422;
    throw err;
  }
  try{
    const user = await User.findById(req.userId)
  
    if(!user){
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    user.status = newStatus;
    await user.save();
  
    res.status(200).json({
      msg: 'User updated successfully'
    })
  }
  catch(err){
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    }
};