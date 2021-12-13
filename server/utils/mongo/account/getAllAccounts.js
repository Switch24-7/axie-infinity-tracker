const Account = require('../../../models/account');

module.exports = async function getAllAccounts() {
  // Find all accounts and sort by name alphabetically
  const result = await Account.find().sort({ name: 1 }).catch((err) => {
    console.error(err);
  });
  return result;
};
