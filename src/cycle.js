const dayJs = require('dayjs')
const bets = require('./bets')
const { getRandomInt } = require('./service')
const states = require('./state')
module.exports = {
  timerWs:
    (ws, aWs) =>
      setInterval(async () => {
        ws.send("Принимаем ставки")
        states.stavka = true

        setTimeout(() => {
          ws.send("Рулетка запускается через 3")
        }, 7000)
        setTimeout(() => {
          ws.send("Рулетка запускается через 2")
        }, 8000)
        setTimeout(() => {
          ws.send("Рулетка запускается через 1")
          states.stavka = false
        }, 9000)

        setTimeout(() => {
          ws.send("Крутим рулетку")
        }, 10000)

        setTimeout(() => {
          if (states.number === null) {
            states.isResult = true
          }
        }, 11000)

        setTimeout(async () => {
          aWs.clients.forEach(client => {
            client.send(`${states.number}`)
          })
          await bets.calculateBets()
        }, 13000)

        setTimeout(async () => {
          await bets.getResultFromBets(ws, aWs)
        }, 16000)

        setTimeout(async () => {
          ws.send('Обновляем баланс')
          await bets.dropBets()
          states.isResult = false
          states.number = null
        }, 18000)


        setTimeout(() => {
          states.date = dayJs(new Date())
        }, 19000)
      }, 20000),
  timerServer:
    () =>
      setInterval(async () => {
        states.check = dayJs(new Date()).diff(states.date)

        if (states.isResult) {
          states.number = getRandomInt(36)
        }

      }, 1000)
}