const mongoose = require('mongoose');

const { Schema } = mongoose;

const SnapshotSchema = new Schema({
  eth: {
    type: String,
    required: true,
    indexed: true,
  },
  total: {
    type: Number,
    required: true,
  },
  totalClaimed: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Snapshot = mongoose.model('Snapshot', SnapshotSchema);
module.exports = Snapshot;
