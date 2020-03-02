const express = require('express');
const jwt = require('jsonwebtoken');

const verifyToken = require('../utils/verifyToken');

const Product = require('./Product');

const router = express.Router();

router.post('/', verifyToken, (req, res) => {

  const data = req.body;

  const slug = data.title.replace(' ', '-').toLowerCase();
  data.slug = slug;

  jwt.verify(req.token, process.env.SECRET_KEY, async (err, _) => {
    if (!err) {
      try {
        const product = new Product(data);
        await product.save();
        res.sendStatus(201);
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

router.get('/', async (_, res) => {

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
    const products = await Product.findOne({ slug })
      .select('title slug author price image description');

    res.status(200).send(products);
  }
  catch (err) {
    console.log(err);
  }

});

module.exports = router;