const Snapshot = require('../../../models/snapshot');

module.exports = async function getSnapshots(eth) {
  const result = await Snapshot.find({ eth }).catch((err) => {
    console.error(err);
  });
  return result;
};
