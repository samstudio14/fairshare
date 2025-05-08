import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  memberIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
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

// TTL index: Delete documents 14 days after last activity
groupSchema.index({ lastActive: 1 }, { expireAfterSeconds: 1209600 }); // 14 days

// Update lastActive timestamp before saving
groupSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

export const Group = mongoose.models.Group || mongoose.model('Group', groupSchema); 