const dayJs = require('dayjs')
const { bid, getRandomInt } = require('./service')
const states = require('./state')

module.exports = {
  generateNum:
    setInterval(() => {
      states.number = getRandomInt(36)

      states.currentBet.forEach(cur => {
        let resultBet = bid(cur.bet, cur.money, states.number)
        states.users.forEach(user => {
          if (user.name === cur.name) {
            if (resultBet.finalMoney !== 0) {
              user.balance = user.balance + resultBet.finalMoney
              cur.money = resultBet.finalMoney
            } else {
              cur.money = 0
            }
          }
        })
      })
    }, 25000),
  timer: setInterval(() => {
    states.check = dayJs(new Date()).diff(states.date)
    if (states.check < 16000) {
      states.stavka = true
    }
    if (states.check > 16000 && states.check < 17000) {
      states.krutilka = true
      states.stavka = false
    }
    if (states.check > 25000 && states.check < 26000) {
      states.isSend = true
    }
    if (states.check > 28000 && states.check < 29000) {
      states.balance = true
    }
    if (states.check > 29000 && states.check < 33000) {
      states.currentBet = []
      states.number = null
    }
    if (states.check > 33000 && states.check < 34000) {
      states.refresh = true
    }
    if (states.check >= 33000) {
      states.refresh = true
      states.date = dayJs(new Date())
    }
  }, 1000),
  renderMessages: (ws, aWs) => setInterval(() => {
    if (states.isSend) {
      aWs.clients.forEach(client => {
        client.send(JSON.stringify({ result: states.number }))
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
      states.currentBet.forEach(cur => {
        if (cur.name === ws.name) {
          if (cur.money === 0) {
            ws.send(JSON.stringify({ text: "Проигрыш", money: cur.money }))
          }
          else {
            ws.send(JSON.stringify({ text: "Победа", money: cur.money }))
          }
          states.users.forEach(user => {
            if (user.name === cur.name) {
              ws.send(JSON.stringify({ text: "Обновляем ваш баланс... ", balance: user.balance }))
            }
          })
        }
      })
      states.balance = false
    }
    if (states.refresh) {
      ws.send('Принимаем ставки')
      states.refresh = false
    }

    if (states.check > 13000 && states.check < 14000) {
      ws.send("Рулетка запустится через 3")
    }
    if (states.check > 14000 && states.check < 15000) {
      ws.send("Рулетка запустится через 2")
    }
    if (states.check > 15000 && states.check < 16000) {
      ws.send("Рулетка запустится через 1")
    }
  }, 1000)
}