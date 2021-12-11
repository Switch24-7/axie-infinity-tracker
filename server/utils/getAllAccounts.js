const Account = require('../models/account');

module.exports = async function getAllAccounts() {
  const result = await Account.find().then((docs) => docs).catch((err) => {
    console.error(err);
  });
  return result;
};
