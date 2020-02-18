const express = require('express');
const mongoose = require('mongoose');

const app = express();

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