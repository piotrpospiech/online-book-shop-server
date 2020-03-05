const express = require('express');

const User = require('./User');

const router = express.Router();

router.post('/', async (req, res) => {
  const data = req.body;

  try {
    const user = new User(data);
    await user.save();

    res.sendStatus(201);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;