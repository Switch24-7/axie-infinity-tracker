const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	eth: {
		type: String,
		required: true,
		indexed: true
	},
	managerShare: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;