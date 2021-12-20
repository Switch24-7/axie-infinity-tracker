const express = require('express');
const axios = require('axios');
const getSnapshots = require('../utils/mongo/snapshot/getSnapshots');
const getRecentSnapshots = require('../utils/mongo/snapshot/getRecentSnapshots');
const getAllAccounts = require('../utils/mongo/account/getAllAccounts');
const ApiError = require('../error/ApiError');

const router = express.Router();

router.get('/slp/today', async (req, res, next) => {
  const { ethList } = req.query;

  if (!ethList) {
    return next(ApiError.badRequest('a list of eth is required!'));
  }

  const eths = ethList.split(',');
  let ethParams = '';
  eths.forEach((eth, idx, array) => {
    if (idx !== array.length - 1) {
      ethParams += `${eth},`;
    } else ethParams += `${eth}`;
  });

  try {
    const promises = [];
    const data = await axios.get(`${process.env.API}/slp/${ethParams}`).then((response) => response.data);
    data.forEach((datum) => {
      const eth = `ronin:${datum.client_id.substring(2, datum.client_id.length)}`;
      promises.push(
        getRecentSnapshots(eth, 1).then((result) => {
          const today = datum.total - result[0].total;
          return {
            eth,
            today: today || 0,
          };
        }),
      );
    });
    const promiseResults = await Promise.all(promises);
    const todayResults = {};
    promiseResults.forEach((promiseResult) => {
      todayResults[promiseResult.eth] = promiseResult.today;
    });
    return res.json({
      todayResults,
    });
  } catch (err) {
    console.error(err.response.status, '\n', err.response.statusText);
    return next(ApiError.internal('Something went wrong!!'));
  }
});

router.get('/slp/history', async (req, res, next) => {
  const accounts = await getAllAccounts().catch((err) => {
    console.error(err);
    return next(ApiError.internal('Something went wrong'));
  });

  const promises = [];

  accounts.forEach((account) => {
    const { eth } = account;
    promises.push(getSnapshots(eth).then((docs) => {
      const results = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < docs.length - 1; i++) {
        const currentDoc = docs[i];
        const previousDoc = docs[i + 1];
        const currentTotal = currentDoc.total - currentDoc.totalClaimed;
        results.push({
          currentTotal,
          dayTotal: currentDoc.total - previousDoc.total,
          date: previousDoc.createdAt,
        });
      }
      return {
        name: account.name,
        eth: account.eth,
        managerShare: account.managerShare,
        snapshots: results,
      };
    }));
  });

  const result = await Promise.all(promises).catch((err) => {
    console.error(err);
    return next(ApiError.internal('Something went wrong!'));
  });

  res.json(result);
});

module.exports = router;
