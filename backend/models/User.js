const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
  },
   email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
    password: {
    type: String,
    required: true
  },
   role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
    lastLogin: {
    type: Date,
    default: null,
  }

});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);