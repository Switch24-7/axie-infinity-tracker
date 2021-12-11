require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const getAllAccounts = require('../utils/getAllAccounts');
const addSnapshot = require('../utils/addSnapshot');

async function createSnapshot(account) {
  const result = await axios.get(`${process.env.API}/slp/${account.eth}`).then(
    (response) => {
      const { data } = response;
      return addSnapshot(account, data[0].total, data[0].claimable_total).catch(() => {});
    },
  );
  return result;
}

console.time('elapsed time');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database!');
  return getAllAccounts();
}).then((accounts) => {
  const promises = [];
  accounts.forEach((account) => {
    promises.push(createSnapshot(account));
  });
  return Promise.all(promises);
}).then(() => {
  const date = new Date();
  console.log('Successfully executed job!', date.toUTCString());
  console.timeEnd('elapsed time');
  mongoose.connection.close();
});
