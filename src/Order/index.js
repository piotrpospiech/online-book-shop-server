const express = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const verifyToken = require('../utils/verifyToken');

const Order = require('./Order');
const Product = require('../Product/Product');

const router = express.Router();

router.post('/', async (req, res) => {

  const { productsData, billingDetails } = req.body;

  const products = [];
  let total = 0;
  for (let i = 0; i < productsData.length; i++) {
    let product = await Product.findOne({ slug: productsData[i].slug })
      .select('title slug author price');

    const quantity = productsData[i].quantity;
    product.set( 'quantity', quantity, { strict: false });
    products.push(product);
    total += product.price * quantity;
  }


  const date = moment();

  const data = {
    products,
    total,
    billingDetails,
    date
  };

  try {
    const order = new Order(data);
    await order.save();
    res.sendStatus(201);
  }
  catch (err) {
    console.log(err);
  }
});

router.get('/', verifyToken, (req, res) => {

  const { completed } = req.query;

  jwt.verify(req.token, process.env.SECRET_KEY, async (err, _) => {
    if (!err) {
      try {
        const orders = await Order.find({ completed })
          .sort({ date: 'desc' });
        res.status(200).send(orders);
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      res.send(403);
    }
  });

});

router.put('/:id', verifyToken, (req, res) => {

  const { id } = req.params;

  jwt.verify(req.token, process.env.SECRET_KEY, async (err, _) => {
    if (!err) {
      try {
        const order = await Order.findByIdAndUpdate(id, { completed: true });
        res.status(200).send(order);
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      res.send(403);
    }
  });

});

module.exports = router;