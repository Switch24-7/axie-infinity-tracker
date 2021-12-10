require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios')

const port = 4000

const app = express()

// middlewares
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors({
  origin: '*',
  credentials: true
}))

// https://game-api.axie.technology/battlelog/RONIN_ADDRESS
// https://game-api.axie.technology/slp/RONIN_ADDRESS
// https://game-api.axie.technology/mmr/RONIN_ADDRESS
const api = 'https://game-api.axie.technology'
const ronin = ''

// index page
app.get('/', async (req, res) => {
  const data = await axios.get(`${api}/slp/${ronin}`).then((res) => {
    return res.data
  })
  res.json(data)
})

app.listen(process.env.port || port, () => {
  const _port = process.env.port ? process.env.port : port
  console.log(`Listening on port ${_port}`)
})