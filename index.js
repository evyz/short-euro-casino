const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const aWs = expressWs.getWss('/')

const states = require('./src/state')
const cycles = require('./src/cycles')
const message = require('./src/ws')
const user = require('./src/user')

cycles.generateNum
cycles.timer

app.use(express.json())

app.post('/register', (req, res) => user.register(req, res))
app.ws('/', async (ws, req) => {
  if (!await user.confirm(req.query.name)) {
    ws.send(JSON.stringify({ error: "Неверный никнейм" }))
    ws.close()
  }
  let obj = await user.me(req.query.name)
  ws.id = obj.id
  ws.name = obj.name
  let wss = ws
  ws.on('message', (msg) => message(msg, wss, aWs, states))
  cycles.renderMessages(wss, aWs)
})

app.listen(9090, () => console.log(`Server started on ${9090} port`))