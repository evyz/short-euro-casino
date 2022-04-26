const e = require('cors');
const { red } = require('./state')
const states = require('./state')

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function writeTheLastBet(obj) {
  states.lastBets.push({
    id: states.lastBets.length === 0 ? 1 : states.lastBets.length,
    number: obj.number,
    date: obj.date
  })
}

function bid(bet, money, result, date) {
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

    writeTheLastBet({ number: resultBet.number, date: states.date })
    return { bet, startMoney: betMoney, finalMoney: money, result: resultBet }
  }

  if (bet === 'red' || bet === 'black') {
    let status = false
    switch (bet) {
      case "red":

        // Исправить ошибку с выводом денег если выиграл!

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

  bet >= 0 && bet <= 36 &&
    bet === result
    ? money = money * 36
    : money = 0

  if (bet === "even" || bet === "odd") {
    switch (bet) {
      case "even":
        result % 2 === 0
          ? money = money * 2
          : money = 0
        break
      case "odd":
        result % 2 === 1
          ? money = money * 2
          : money = 0
        break
    }
  }
  writeTheLastBet({ number: resultBet.number, date: states.date })
  return { bet, startMoney: betMoney, finalMoney: money, result: resultBet }
}


module.exports = {
  bid,
  getRandomInt
}