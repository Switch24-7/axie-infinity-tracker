module.exports = function getPhDate() {
  const current = new Date();
  const offset = 8 * 60 * 60 * 1000; // 8 hours
  return new Date(current.getTime() + offset); // Philippine Standard Time = UTC+8
};
