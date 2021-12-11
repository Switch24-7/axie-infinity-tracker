const Snapshot = require('../models/snapshot');

module.exports = async function addSnapshot(account, total, totalClaimed) {
  // eslint-disable-next-line no-underscore-dangle
  const accountId = account._id;
  const result = await Snapshot.create({
    accountId,
    total,
    totalClaimed,
  }).catch(() => {
    console.log('Failed to create Snapshot with values', accountId, total, totalClaimed);
  });
  return result;
};
