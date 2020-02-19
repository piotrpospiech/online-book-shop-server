const express = require('express');

const Product = require('./Product');

const router = express.Router();

router.post('/', async (req, res) => {

  const data = req.body;

  const slug = data.title.replace(' ', '-').toLowerCase();
  data.slug = slug;

  console.log(data);

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
      .select('title slug author price image');

    res.status(200).send(products);
  }
  catch (err) {
    console.log(err);
  }

});

router.get('/:slug', async (req, res) => {

  const { slug } = req.params;

  try {
    const products = await Product.findOne({ slug: slug })
      .select('title slug author price image description');

    res.status(200).send(products);
  }
  catch (err) {
    console.log(err);
  }

});

module.exports = router;