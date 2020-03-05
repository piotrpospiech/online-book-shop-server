const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const del = require('del');

const verifyToken = require('../utils/verifyToken');

const Product = require('./Product');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(_, _, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    const mimeTypeArr = file.mimetype.split('/');
    const type = mimeTypeArr[mimeTypeArr.length - 1];
    const slug = req.body.title.replace(' ', '-').toLowerCase();
    cb(null, slug + '.' + type);
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
  data.image = `${process.env.SERVER_URL}/${req.file.path}`;

  const slug = data.title.replace(' ', '-').toLowerCase();
  data.slug = slug;

  jwt.verify(req.token, process.env.SECRET_KEY, async (err, _) => {
    if (!err) {
      try {
        const oldProduct = await Product.findOne({ slug: data.slug });

        if (!oldProduct) {
          const product = new Product(data);
          await product.save();
          res.sendStatus(201);
        }
        else {
          res.send({ message: 'Product name is already taken!' });
        }
        
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      res.sendStatus(403);
    }
  });
});

router.put('/', verifyToken, upload.single('file'), (req, res) => {

  const { title, author, description, price } = req.body;

  const image = req.file ? `${process.env.SERVER_URL}/${req.file.path}` : null;

  const slug = title.replace(' ', '-').toLowerCase();

  jwt.verify(req.token, process.env.SECRET_KEY, async (err, _) => {
    if (!err) {
      try {
        if (image) {
          await Product.findOneAndUpdate({ slug }, {
            author,
            description,
            price,
            image
          });
        }
        else {
          await Product.findOneAndUpdate({ slug }, {
            author,
            description,
            price
          });
        }
        res.sendStatus(200);
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      res.sendStatus(403);
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

router.delete('/:slug', verifyToken, (req, res) => {

  const { slug } = req.params;

  jwt.verify(req.token, process.env.SECRET_KEY, async (err, _) => {
    if (!err) {
      try {
        await Product.findOneAndDelete({ slug });
        await del([`uploads/${slug}.*`]);
        res.sendStatus(200);
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      res.sendStatus(403);
    }
  });
});

module.exports = router;