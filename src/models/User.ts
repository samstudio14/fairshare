import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
  lastActive: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index: Delete documents 1 year after last activity
userSchema.index({ lastActive: 1 }, { expireAfterSeconds: 31536000 }); // 365 days

// Update lastActive timestamp before saving
userSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

export const User = mongoose.models.User || mongoose.model('User', userSchema); 