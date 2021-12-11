const mongoose = require('mongoose');

const { Schema } = mongoose;

const EarningSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    indexed: true,
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Earning = mongoose.model('Earning', EarningSchema);
module.exports = Earning;
