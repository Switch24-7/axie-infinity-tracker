const axios = require('axios');
const addSnapshot = require('./addSnapshot');
const getAllAccounts = require('./getAllAccounts');
const getPhDate = require('./getPhDate');

let wait = false;

async function createDailySnapshot(account) {
  return axios.get(`${process.env.API}/slp/${account.eth}`).then(
    (response) => {
      const { data } = response;
      return addSnapshot(account, data.total, data.claimable_total).catch(() => {});
    },
  );
}

module.exports = async function gatherDailySnapshot() {
  if (!wait) {
    const date = getPhDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    if (hours === 0 && minutes === 0) {
      console.log('It\'s 12:00 am. Proceeding to gather daily earnings report...');
      const accounts = await getAllAccounts();
      if (accounts) {
        const promises = [];
        accounts.forEach((account) => {
          promises.push(createDailySnapshot(account));
        });
        await Promise.all(promises).catch((err) => {
          console.error('An error occured when gathering snapshots!\n', err);
        });
      }
      wait = true;
      setTimeout(() => {
        wait = false;
      }, 5 * 60 * 1000); // 5 minutes
    }
  }
  setTimeout(gatherDailySnapshot, 55 * 1000); // 30 seconds
};
