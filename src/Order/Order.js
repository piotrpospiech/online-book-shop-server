const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  products: [
    {
      title: {
        type: String,
        required: true
      },
      slug: {
        type: String,
        required: true
      },
      author: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  billingDetails: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    address: {
      streetAndHouseNumber: {
        type: String,
        required: true
      },
      apartment: {
        type: String
      }
    },
    postcode: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    email: {
      type: String,
      required: true
    }
  }
});

module.exports = model('Order', orderSchema);