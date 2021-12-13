const Snapshot = require('../../../models/snapshot');

module.exports = async function addSnapshot(account, total, totalClaimed) {
  const { eth } = account;
  const result = await Snapshot.create({
    eth,
    total,
    totalClaimed,
  }).catch(() => {
    console.log('Failed to create Snapshot with values', eth, total, totalClaimed);
  });
  return result;
};
