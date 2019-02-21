const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const { String } = Schema.Types;

const offerSchema = new Schema({
  userID: {
    type: ObjectId,
    ref: 'User',
  },
  username: {
    type: String,
    ref: 'User',
  },
  userDescription: {
    type: String,
    ref: 'User',
  },
  from: { type: String },
  until: { type: String },
  location: { type: String },
  budget: { type: String },
}, { timestamps: true });

// If set timestamps, mongoose assigns createdAt and updatedAt
// fields to your schema, the type assigned is Date.

// const userID = req.session.currentUser._id;
// const userName = req.session.currentUser.name

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
