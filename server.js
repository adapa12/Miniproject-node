'use strict'

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const user = require('./src/routes/user');
const cart = require('./src/routes/cart');
const product = require('./src/routes/product');
const checkout  = require('./src/routes/checkout');
const Order = require('./src/routes/order');


require('dotenv').config();

let port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((data) => {
  console.log("DB Connected Successfully !");
}).catch((error) => {
  console.log(error.message);
});

app.use('/api/v1/user', user);
app.use('/api/v1/product', product);
app.use('/api/v1/cart', cart);
app.use('/api/v1/checkout',checkout);
app.use('/api/v1/order',Order);



app.listen(port, ()=>{
    console.log(`Server Listening on Port ${port}`);
})