const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const bidSchema = new Schema({

  userID: {
    type: ObjectId,
    ref: 'User',
  },
  offerID: {
    type: ObjectId,
    ref: 'Offer',
  },
  bidValue: {
    type: Number,
  },
  bidDescription: {
    type: String,
  },
  Status: {
    type: Number,
    default: 0,
  },
  accomodationImage: {
    type: String,
  },
}, { timestamps: true });

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
