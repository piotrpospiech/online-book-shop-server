const express = require('express');

const Order = require('./Order');
const Product = require('../Product/Product');

const router = express.Router();

router.post('/', async (req, res) => {

  const { productSlugs, billingDetails } = req.body;

  const products = [];
  let total = 0;
  for (let i = 0; i < productSlugs.length; i++) {
    const product = await Product.findOne({ slug: productSlugs[i] })
      .select('title slug author price');
    products.push(product);
    total += product.price;
  }

  const data = {
    products,
    total,
    billingDetails
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

router.get('/', async (req, res) => {

  const { completed } = req.query;

  try {
    const orders = await Order.find({ completed });
    res.status(200).send(orders);
  }
  catch (err) {
    console.log(err);
  }

});

module.exports = router;