const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isRemove: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('User', UserSchema);
