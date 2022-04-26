const db = require('./db/index')
const states = require('./state')
const { bid } = require('./service')

class BetsService {
  async dropBets() {
    await db('CurrentBets').truncate()
  }

  async calculateBets() {
    let arr = await db('CurrentBets')
    arr.forEach(async row => {
      let resultBet = bid(row.bet, row.money, states.number)
      console.log(resultBet)
      let user = await db('Users').where({ id: row.userId }).first()
      if (resultBet.finalMoney !== 0) {
        user.balance = user.balance + resultBet.finalMoney
        await db('Users').update({ balance: user.balance }).where({ id: user.id })
      } else {
        await db("CurrentBets").update({ money: 0 }).where({ userId: user.id })
      }
    })
  }

  async getResultFromBets(ws, aWs) {
    let arr = await db('CurrentBets')

    arr.forEach(async row => {
      console.log(row)
      if (row.money === 0) {
        ws.send(JSON.stringify({ text: "Проигрыш", money: row.money }))
      } else {
        ws.send(JSON.stringify({ text: "Победа", money: row.money }))
      }
    })

    aWs.clients.forEach(client => {
      client.send("Обновляем Ваш баланс...")
    })
  }
}

module.exports = new BetsService()