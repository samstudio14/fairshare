import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  splitBetweenIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  customSplits: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for group expenses
expenseSchema.index({ groupId: 1, createdAt: 1 });

// Middleware to update group's lastActive on expense creation
expenseSchema.pre('save', async function(next) {
  try {
    const Group = mongoose.model('Group');
    await Group.findByIdAndUpdate(this.groupId, { lastActive: new Date() });
    next();
  } catch (error) {
    next(error);
  }
});

export const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema); 