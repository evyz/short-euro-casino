const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const aWs = expressWs.getWss('/')

const states = require('./src/state')
const cycles = require('./src/cycles')
const message = require('./src/ws')

cycles.generateNum
cycles.timer

app.ws('/', (ws, req) => {
  ws.name = req.query.name
  let wss = ws
  ws.on('message', (msg) => message(msg, wss, aWs, states))
  cycles.renderMessages(wss, aWs)
})

app.listen(9090, () => console.log(`Server started on ${9090} port`))