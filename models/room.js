const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const { String } = Schema.Types;

const roomSchema = new Schema({
  userID: {
    type: ObjectId,
    ref: 'User',
  },
  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
  },
  accomodationDescription: { type: String },
  accomodationImage: { type: String },
  facilities: [String],
}, { timestamps: true });

roomSchema.index({ location: '2dsphere' });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
