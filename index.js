const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const aWs = expressWs.getWss('/')

const states = require('./src/state')
const message = require('./src/ws')
const user = require('./src/user')
const cycle = require('./src/cycle')

// --- Сделать лимит на ставку + запрет на ставку больше своего баланса

cycle.timerServer()

app.use(express.json())

app.post('/register', (req, res) => user.register(req, res))
app.ws('/', async (ws, req) => {
  if (!await user.confirm(req.query.name)) {
    ws.send(JSON.stringify({ error: "Неверный никнейм" }))
    ws.close()
  }
  let { id, name } = await user.me(req.query.name)
  ws.id = id
  ws.name = name
  let wss = ws
  cycle.timerWs(wss, aWs)
  ws.on('message', (msg) => message(msg, wss, aWs, states))
})

app.listen(9090, () => console.log(`Server started on ${9090} port`))