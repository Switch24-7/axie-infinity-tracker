require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT, process.env.TWILIO_AUTH);
const getAllAccounts = require('../utils/mongo/account/getAllAccounts');
const addSnapshot = require('../utils/mongo/snapshot/addSnapshot');

async function createSnapshot(account) {
  try {
    return axios.get(`${process.env.API}/slp/${account.eth}`).then(
      (response) => {
        const { data } = response;
        return addSnapshot(account, data[0].total, data[0].claimable_total).catch(() => {});
      },
    );
  } catch (e) {
    console.error(e.response.status, '\n', e.response.statusText);
    return e;
  }
}

const date = new Date();
const startTime = Date.now();

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
  console.log('in here\n');
  const endTime = Date.now();
  const message = `Successfully executed job! ${date.toUTCString()}\nElapsed time: ${(endTime - startTime) / 1000} seconds`;
  console.log(message);
  mongoose.connection.close();
  return twilio.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: process.env.MY_PHONE,
  });
})
  .catch((err) => {
    const message = `An error occured when executing the job! Snapshots may or may not have been created...\n${date.toUTCString()}`;
    console.error(err);
    mongoose.connection.close();
    return twilio.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: process.env.MY_PHONE,
    });
  });
