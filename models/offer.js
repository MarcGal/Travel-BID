const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const { String } = Schema.Types;

const offerSchema = new Schema({
  userID: {
    type: ObjectId,
    ref: 'User',
  },
  from: { type: String },
  until: { type: String },
  location: { type: String },
  budget: { type: Number },
  bids: { type: Array },
}, { timestamps: true });


const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
