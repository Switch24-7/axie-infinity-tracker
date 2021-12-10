require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database');
}).catch((err) => console.error(err));

const app = express();
const PORT = 4000;

// middlewares
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true,
}));

// https://game-api.axie.technology/battlelog/RONIN_ADDRESS
// https://game-api.axie.technology/slp/RONIN_ADDRESS
// https://game-api.axie.technology/mmr/RONIN_ADDRESS
const api = 'https://game-api.axie.technology';
const ronin = '';

// index page
app.get('/', async (req, res) => {
  const data = await axios.get(`${api}/slp/${ronin}`).then((response) => response.data);
  res.json(data);
});

app.listen(process.env.port || PORT, () => {
  const port = process.env.port ? process.env.port : PORT;
  console.log(`Listening on port ${port}`);
});
