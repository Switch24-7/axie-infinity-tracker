const Account = require('../../../models/account');

module.exports = async function getAccount(eth) {
  const result = await Account.find({ eth }).catch((err) => {
    console.error(err);
  });
  return result;
};
