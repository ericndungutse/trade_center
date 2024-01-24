const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },

  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
  },

  photo: { type: String, default: 'default.jpg' },

  role: {
    type: String,
    enum: ['systemadmin', 'company', 'user'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },

  active: {
    type: String,
    default: true,
    select: false,
  },

  verified: {
    type: String,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // CHECK IF PASSWORD WAS MODIFIED
  // IF NO, Return AND GO OVER
  if (!this.isModified('password')) return next();

  // IF YES HASH THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
