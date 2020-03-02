const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const verifyToken = require('../utils/verifyToken');

const Product = require('./Product');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(_, _, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    const slug = req.body.title.replace(' ', '-').toLowerCase();
    cb(null, slug + '-' + file.originalname);
  }
});

const fileFilter = (_, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  else {
    cb (null, false);
  }
};

const upload = multer({ 
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

router.post('/', verifyToken, upload.single('file'), (req, res) => {

  const data = req.body;
  data.image = `http://localhost:5000/${req.file.path}`;

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