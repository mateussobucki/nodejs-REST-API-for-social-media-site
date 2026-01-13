const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const { METHODS } = require('http');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()} - ${file.originalname}`)
  }
});

const fileFilter = (req, file, cb) => {
  if(
    file.mimetype === 'images/png' || 
    file.mimetype === 'images/jpg' || 
    file.mimetype === 'images/jpeg'
  ){
    cb(null, true);
  } else {
    cb(null, false);
  };
}

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({
  storage: fileStorage,
  filter: fileFilter
}).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const msg = error.msg; //existe por padrão
  const data = error.data;
  res.status(status).json({
    msg: msg,
    data: data
  });
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mk3ycwc.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true`)
.then(result => {
  const server = app.listen(8080);
  const io = require('./socket').init(server);
  io.on('connection', socket => {
    console.log('Client connected')
  })
})
.catch(err => console.log(err));