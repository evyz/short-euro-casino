const dayJs = require('dayjs')
const { getRandomInt } = require('./service')
const bets = require('./bets')
const states = require('./state')
const { isResult } = require('./state')

module.exports = {
  generateNum:
    setInterval(async () => {
      if (states.isResult) {
        states.number = getRandomInt(36)
        await bets.calculateBets().then(() => {
          states.isResult = false
        })
      }
    }, 1000),
  timer: setInterval(async () => {
    states.check = dayJs(new Date()).diff(states.date)
    if (states.check < 15000) {
      states.stavka = true
    }
    if (states.check > 16000 && states.check < 17000) {
      states.krutilka = true
      states.stavka = false
      if (states.number === null) {
        states.isResult = true
      }
    }
    if (states.check > 20000 && states.check < 26000) {
      states.isSend = true
    }
    if (states.check > 27000 && states.check < 29000) {
      states.balance = true
    }
    if (states.check > 30000 && states.check < 33000) {
      await bets.dropBets()
      states.number = null
    }
    if (states.check > 34000 && states.check < 35000) {
      states.refresh = true
    }
    if (states.check >= 36000) {
      states.users = []
      states.refresh = true
      states.date = dayJs(new Date())
    }
  }, 1000),
  renderMessages: (ws, aWs) => setInterval(async () => {
    if (states.isSend) {
      aWs.clients.forEach(client => {
        let status = true
        states.users.forEach(user => {
          if (user.name === client.name) {
            status = false
          }
        })
        if (status) {
          states.users.push(client)
          client.send(JSON.stringify({ result: states.number }))
        }
      })
      states.isSend = false
    }
    if (states.krutilka) {
      aWs.clients.forEach(client => {
        client.send("Крутим рулетку...")
      })
      states.krutilka = false
    }
    if (states.balance) {
      await bets.getResultFromBets(ws, aWs)
      states.balance = false
    }
    if (states.refresh) {
      ws.send('Принимаем ставки')
      states.refresh = false
    }

    if (states.check > 11000 && states.check < 12000) {
      ws.send("Рулетка запустится через 3")
    }
    if (states.check > 13000 && states.check < 14000) {
      ws.send("Рулетка запустится через 2")
    }
    if (states.check > 15000 && states.check < 16000) {
      ws.send("Рулетка запустится через 1")
    }
  }, 1000)
}