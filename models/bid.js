const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const bidSchema = new Schema({
  userID: {
    type: ObjectId,
    ref: 'User',
  },
  offerID: {
    type: String,
  },
  userName: {
    type: String,
    ref: 'User',
  },
  userDescription: {
    type: String,
    ref: 'User',
  },
  accomodationAddress: {
    type: String,
    ref: 'User',
  },
  accomodationDescription: {
    type: String,
    ref: 'User',
  },
}, { timestamps: true });

// If set timestamps, mongoose assigns createdAt and updatedAt
// fields to your schema, the type assigned is Date.

// const userID = req.session.currentUser._id;
// const userName = req.session.currentUser.name

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
