import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
  },
   email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
    password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters'],
  },
   role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
    lastLogin: {
    type: Date,
    default: null,
  },
  resetPasswordToken: {
     type: String 
    },
  resetPasswordExpire: { type: Date
   },

});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', userSchema);