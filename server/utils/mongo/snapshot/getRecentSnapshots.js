const Snapshot = require('../../../models/snapshot');

module.exports = async function getRecentSnapshots(eth, limit) {
  // Find all snapshots with the exact eth value
  // then sort from latest to oldest
  const result = await Snapshot.find({ eth }).sort({ createdAt: -1 }).limit(limit).catch((err) => {
    console.error(err);
  });
  return result;
};
