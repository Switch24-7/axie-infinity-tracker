const express = require('express');
// const axios = require('axios');
const getSnapshots = require('../utils/mongo/snapshot/getSnapshots');
const getAllAccounts = require('../utils/mongo/account/getAllAccounts');
const ApiError = require('../error/ApiError');

const router = express.Router();

/*
router.get('/slp/today', async (req, res, next) => {
  // axios.get(`${process.env.API}/slp/${account.eth}`).then((response) => response.data)
});
*/

router.get('/slp/history', async (req, res, next) => {
  const accounts = await getAllAccounts().catch((err) => {
    console.error(err);
    return next(ApiError.internal('Something went wrong'));
  });

  const promises = [];

  accounts.forEach((account) => {
    const { eth } = account;
    promises.push(getSnapshots(eth).then((doc) => {
      const { name } = account;
      const yesterday = doc[1].total - doc[0].total;
      doc.unshift(yesterday);
      doc.unshift(name);
      return doc;
    }));
  });

  const result = await Promise.all(promises).catch((err) => {
    console.error(err);
    return next(ApiError.internal('Something went wrong!'));
  });

  res.json(result);
});

module.exports = router;
