const Earning = require('../models/earning');

module.exports = async function addAccount(account, total) {
  const result = await Earning.create({
    // eslint-disable-next-line no-underscore-dangle
    accountId: account._id,
    total,
  }).catch(() => {});
  return result;
};
