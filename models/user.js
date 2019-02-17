const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// If set timestamps, mongoose assigns createdAt and updatedAt
// fields to your schema, the type assigned is Date.

const User = mongoose.model('User', userSchema);

module.exports = User;
