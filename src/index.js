const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

const products = require('./Product');
const users = require('./User');
const auth = require('./User/auth');
const orders = require('./Order');

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/products', products);
app.use('/users', users);
app.use('/auth', auth);
app.use('/orders', orders);

const main = async () => {
  try {
      console.log('Trying to connect with MongoDB...');
      await mongoose.connect('mongodb://localhost:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB...');

      const port = process.env.PORT || 5000;
      app.listen(port, () => console.log(`Listening on port ${port}...`));
  } catch (err) {
      console.log('Could not connect to MongoDB:\n', err);
  }
};

main();