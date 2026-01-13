const fs = require('fs');
const path = require('path');

const {validationResult} = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments()
    const posts = await Post.find()
      .populate('creator')
      .sort({createdAt: -1})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  
    res.status(200).json({
      msg: 'Posts fetched successfully',
      posts: posts,
      totalItems: totalItems
    })
  }
  catch(err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try{
    const post = await Post.findById(postId)
      if(!post){
        const err = new Error('Post not found');
        err.statusCode = 404;
        throw(err); //Esse erro vai ser jogado pro catch ent n precisa chamar next()
      }
    res.status(200).json({
      post: post
    })
  }
  catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  };
};

exports.postPost = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const err = new Error('Validation failed, entered data is invalid')
    err.statusCode = 422;
    throw err; 
  };
  if(!req.file){
    const err = new Error('Missing image file');
    err.statusCode = 422;
    throw err;
  };
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId 
    });
    await post.save()

    const user = await User.findById(req.userId);
   
    user.posts.push(post);
    await user.save();
    
    io.getIO().emit('posts', {action: 'create', post: {...post.doc, creator: {_id: req.userId, name: user.name}}});
    res.status(201).json({
       msg: "Post created successfully",
      post: post,
      creator: {_id: user._id, name: user.name}
    });
  }
  catch(err) {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  };
}

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const err = new Error('Validation failed, entered data is invalid')
    err.statusCode = 422;
    throw err;
  };

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  
  if(req.file){
    imageUrl = req.file.path;
  }
  if(!imageUrl){
    const err = new Error('Image file not found');
    err.statusCode = 422;
    throw err;
  }
  try {
    const post = await Post.findById(postId).populate('creator')
    
      if(!post){
        const err = new Error('Post not found');
        err.statusCode = 404;
        throw err;
      }
      if(post.creator.toString() !== req.userId){
        const err = new Error('Not authorized');
        err.statusCode = 403;
        throw err;
      }
      if(imageUrl !== post.imageUrl){
        clearImage(post.imageUrl);
      }
      
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      const updatedPost = await post.save()
    
      io.getIO().emit('posts', {
        action: 'update',
        post: updatedPost
      })
      res.status(200).json({
        msg: 'Post updated',
        post: result
      })
  }
  catch(err){
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId)
  try {
    if(!post){
      const err = new Error('Post not found');
      err.statusCode = 404;
      throw err;
    }
    if(post.creator._id.toString() !== req.userId){
      const err = new Error('Not authorized');
      err.statusCode = 403;
      throw err;
    }
    clearImage(post.imageUrl);
    
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId)
    
    user.posts.pull(postId);
    await user.save();

    io.getIO().emit('posts', {
      action: 'delete',
      post: postId
    })
    res.status(200).json({
      msg: 'Post deleted'
    })
  }
  catch(err) {
    if(!err.statusCode){
      err.statusCode = 500
    };
    next(err)
  };
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {console.log(err)});
};


