const dayJs = require('dayjs')

module.exports = {
  stavka: true,
  number: null,
  isSend: false,
  krutilka: false,
  balance: false,
  refresh: false,
  date: dayJs(new Date()),
  check: dayJs(new Date()).diff(this.date),
  currentBet: [],
  users: [
    { name: "evyz", balance: 10000 }
  ],
  red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  lastBets: []
}