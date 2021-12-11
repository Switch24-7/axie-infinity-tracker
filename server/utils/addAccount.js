const Account = require('../models/account');

module.exports = async function addAccount(name, eth, managerShare) {
  const result = await Account.findOne({
    eth,
  }).exec().then((res) => {
    if (!res) {
      return Account.create({
        name,
        eth,
        managerShare,
      });
    } return true;
  }).catch(() => {});
  return result;
};
