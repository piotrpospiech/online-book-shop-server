const express = require('express');

const Product = require('./Product');

const router = express.Router();

router.post('/', async (req, res) => {

  const data = req.body;

  try {
    const product = new Product(data);
    await product.save();

    res.sendStatus(201);
  }
  catch (err) {
    console.log(err);
  }
});

router.get('/', async (req, res) => {

  try {
    const products = await Product.find()
      .select('_id title author price image');

    res.status(200).send(products);
  }
  catch (err) {
    console.log(err);
  }

});

router.get('/:id', async (req, res) => {

  const { id } = req.params;

  try {
    const products = await Product.findById(id)
      .select('title author price image description');

    res.status(200).send(products);
  }
  catch (err) {
    console.log(err);
  }

});

module.exports = router;