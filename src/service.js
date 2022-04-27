const { red } = require('./state')
const states = require('./state')
const db = require('./db/index')
const dayJs = require('dayjs')

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function writeTheLastBet(obj) {
  return await db('Lasts').insert({ number: states.number, date: dayJs(states.date).format('YYYY-MM-DDTHH:mm:ss') }).then(async () => {
    let bet = await db("Lasts").where({ date: dayJs(states.date).format('YYYY-MM-DDTHH:mm:ss') }).first()
    return await db('User_Bets').insert({ betsId: bet.id, userId: obj.userId, bet: obj.bet })
  })

}

async function bid(bet, money, result, date, userId) {
  let betMoney = money

  let resultBet = {
    number: result,
    even: result % 2 === 1 ? "odd" : "even",
    color: red.forEach(num => num === result && "red") !== undefined ? "red" : "black"
  }

  if (result === 0) {
    resultBet.even = null
    resultBet.color = null

    if (result === bet) {
      money = money * 36
    } else {
      money = 0
    }

    await writeTheLastBet({ bet, userId: userId })
    return { bet, startMoney: betMoney, finalMoney: money, result: resultBet }
  }

  if (bet === 'red' || bet === 'black') {
    let status = false
    switch (bet) {
      case "red":
        red.forEach(num => {
          if (num === result) {
            status = true
          }
        })
        if (status) {
          money = money * 2
        } else {
          money = 0
        }
        break
      case "black":
        red.forEach(num => {
          if (num === result) {
            status = true
          }
        })
        if (!status) {
          money = money * 2
        } else {
          money = 0
        }
        break
    }
  }

  if (bet >= 0 && bet <= 36) {
    if (bet === result) {
      money = money * 36
    } else {
      money = 0
    }
  }

  if (bet === "even" || bet === "odd") {
    switch (bet) {
      case "even":
        if (result % 2 === 0) {
          money = money * 2
        } else {
          money = 0
        }
        break
      case "odd":
        if (result % 2 === 1) {
          money = money * 2
        }
        else {
          money = 0
        }
        break
    }
  }
  await writeTheLastBet({ bet, userId })
  return { bet, startMoney: betMoney, finalMoney: money, result: resultBet }
}


module.exports = {
  bid,
  getRandomInt
}