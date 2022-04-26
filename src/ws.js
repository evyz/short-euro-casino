module.exports = (msg, ws, aWs, states) => {
  let data = JSON.parse(msg)
  switch (data.type) {
    case "bet":
      if (states.stavka === false) {
        ws.send(JSON.stringify({ error: "Время для ставки закончилось" }))
      } else {
        let status = false
        states.currentBet.forEach(cur => {
          if (cur.name === ws.name) {
            status = true
          }
        })
        if (status) {
          ws.send(JSON.stringify({ error: "Вы уже сделали ставку" }))
        }
        else {
          states.users.forEach(user => {
            user.balance = user.balance - data.money
          })
          states.currentBet.push({ name: ws.name, money: data.money, bet: data.bet })
          ws.send(JSON.stringify({ text: "Ставка принята" }))
        }
      }
      break
    case "balance":
      ws.send(`ваш баланс ${states.users.find(user => user.name === ws.name).balance}`)
      break
  }
}