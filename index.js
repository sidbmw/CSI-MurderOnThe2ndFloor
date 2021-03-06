const {toCsv} = require('./client/build/toCsv.js')
const fs = require('fs')
const express = require('express')
const path = require('path')

const app = express()

const PORT = 3000
const ROOT_DIR = '/client/build'
const CSV_PATH = '/datasets.csv'

// Serve the static files from the React app
app.use(express.json())
app.use(express.static(path.join(__dirname, ROOT_DIR)))

app.post('/upload/dataset', async (req, res) => {
  let obj = JSON.parse(req.body.data)
  try {
    const csvStr = await toCsv(obj)
    fs.writeFileSync(path.join(__dirname, ROOT_DIR + CSV_PATH), csvStr)
    res.status(200).end()
  } catch (e) {
    console.error(e)
    res.status(500).json({errorCode: 500, errorMessage: e.message})
  }
})

// Error handler
app.use(function(req, res) {
  console.error('Unexpected Internal Error')
  res.status(500)
})

app.listen(PORT, err => {
  if (err) console.log(err)
  console.log(`http://localhost:3000`)
})
