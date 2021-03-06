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
  privateRoom: { type: String },
  sharedRoom: { type: String },
  entireProperty: { type: String },
  tv: { type: String },
  wifi: { type: String },
  air: { type: String },
  garage: { type: String },
  termo: { type: String },
  whaser: { type: String },
  pool: { type: String },
  privateBathroom: { type: String },
  wheelchair: { type: String },
  smoke: { type: String },
  pet: { type: String },
  couples: { type: String },

  accomodationDescription: { type: String },
  accomodationImage: { type: String },
  facilities: [String],
}, { timestamps: true });

roomSchema.index({ location: '2dsphere' });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
