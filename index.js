const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const dayJs = require('dayjs')

const { bid } = require('./src/service')
const e = require('express')
const { noData } = require('pg-protocol/dist/messages')

const aWs = expressWs.getWss('/')

let date = dayJs(new Date())
let check = dayJs(new Date()).diff(date)

const users = [
  { name: "evyz", balance: 10000 }
]

let currentBet = []

let stavka = true
let number = null
let isSend = false
let krutilka = false
let balance = false
let refresh = false

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

setInterval(() => {
  number = getRandomInt(36)

  currentBet.forEach(cur => {
    let resultBet = bid(cur.bet, cur.money, number)
    users.forEach(user => {
      if (user.name === cur.name) {
        console.log(resultBet)
        if (resultBet.finalMoney !== 0) {
          user.balance = user.balance + resultBet.finalMoney
          cur.money = resultBet.finalMoney
        } else {
          cur.money = 0
        }
      }
    })
  })
}, 25000)

setInterval(() => {
  check = dayJs(new Date()).diff(date)
  if (check < 16000) {
    stavka = true

  }
  if (check > 16000 && check < 17000) {
    krutilka = true
  }
  if (check > 16000 && check < 25000) {
    stavka = false

  }
  if (check > 25000 && check < 26000) {
    isSend = true
  }
  if (check > 25000 && check < 28000) {

  }
  if (check > 28000 && check < 29000) {
    balance = true
  }
  if (check > 29000 && check < 33000) {
    currentBet = []
    number = null
  }
  if (check > 33000 && check < 34000) {
    refresh = true
  }
  if (check >= 33000) {
    refresh = true
    date = dayJs(new Date())
    // check = dayJs(new Date()).diff(date)
  }
}, 1000)

app.ws('/', (ws, req) => {
  const { name } = req.query

  ws.name = name

  ws.on('message', (msg) => {
    let data = JSON.parse(msg)
    switch (data.type) {
      case "bet":
        if (stavka === false) {
          ws.send(JSON.stringify({ error: "Время для ставки закончилось" }))
        } else {
          users.forEach(user => {
            user.balance = user.balance - data.money
          })
          currentBet.push({ name: ws.name, money: data.money, bet: data.bet })
          ws.send(JSON.stringify({ text: "Ставка принята" }))
        }
        break
      case "balance":
        ws.send(`ваш баланс ${users.find(user => user.name === ws.name).balance}`)
        break
    }

  })

  setInterval(() => {
    if (isSend) {
      aWs.clients.forEach(client => {
        client.send(JSON.stringify({ result: number }))
      })
      isSend = false
    }
    if (krutilka) {
      aWs.clients.forEach(client => {
        client.send("Крутим рулетку...")
      })
      krutilka = false
    }
    if (balance) {
      currentBet.forEach(cur => {
        if (cur.name === ws.name) {
          console.log(cur.money)
          if (cur.money === 0) {
            ws.send(JSON.stringify({ text: "Проигрыш", money: cur.money }))
          }
          else {
            ws.send(JSON.stringify({ text: "Победа", money: cur.money }))
          }
          users.forEach(user => {
            if (user.name === cur.name) {
              ws.send(JSON.stringify({ text: "Обновляем ваш баланс... ", balance: user.balance }))
            }
          })
        }
      })
      balance = false
    }
    if (refresh) {
      ws.send('Принимаем ставки')
      refresh = false
    }

    // console.log(check)
    if (check > 13000 && check < 14000) {
      ws.send("Рулетка запустится через 3")
    }
    if (check > 14000 && check < 15000) {
      ws.send("Рулетка запустится через 2")
    }
    if (check > 15000 && check < 16000) {
      ws.send("Рулетка запустится через 1")
    }
  }, 1000)

  console.log('Подключился')
})

app.listen(8080, () => console.log(`Server started on ${8080} port`))