const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('./User');

const router = express.Router();

router.get('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (user) {
      jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '24h' }, (_, token) => {
        res.json({ token });
      });
    }
    else {
      res.json({ message: 'User not found' });
    }
    
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;