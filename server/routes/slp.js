const express = require('express');
const axios = require('axios');
const getSnapshots = require('../utils/mongo/snapshot/getSnapshots');
const getRecentSnapshots = require('../utils/mongo/snapshot/getRecentSnapshots');
const getAllAccounts = require('../utils/mongo/account/getAllAccounts');
const ApiError = require('../error/ApiError');

const router = express.Router();

router.get('/slp/today', async (req, res, next) => {
  const { eth } = req.query;

  if (!eth) {
    return next(ApiError.badRequest('eth is required!'));
  }

  const data = await axios.get(`${process.env.API}/slp/${eth}`).then((response) => response.data).catch((err) => {
    console.error(err);
    return next(ApiError.internal('Something went wrong!!'));
  });
  const latestSnapshot = await getRecentSnapshots(eth, 1);
  const today = data[0].total - latestSnapshot[0].total;
  return res.json({
    today: today || 0,
  });
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
        const previousTotal = previousDoc.total - previousDoc.totalClaimed;
        results.push({
          currentTotal,
          dayTotal: currentTotal - previousTotal,
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
