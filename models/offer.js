const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const { String } = Schema.Types;

const offerSchema = new Schema({
  userID: {
    type: ObjectId,
    ref: 'User',
  },
  from: { type: Date },
  until: { type: Date },
  location: { type: String, uppercase: true },
  budget: { type: Number },
  Status: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });


const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
