const db = require('./db/index')
const { attachPaginate } = require('knex-paginate');
attachPaginate();

const states = require('./state')
const { bid } = require('./service')

class BetsService {
  async dropBets() {
    await db('CurrentBets').truncate()
  }

  async calculateBets() {
    let arr = await db('CurrentBets')
    arr.forEach(async row => {
      console.log(row.userId)
      let resultBet = await bid(row.bet, row.money, states.number)
      let user = await db('Users').where({ id: row.userId }).first()
      console.log(resultBet)
      if (resultBet.finalMoney > 0) {
        console.log("До расчёта", user.balance, resultBet.finalMoney)
        user.balance = user.balance + resultBet.finalMoney
        console.log("После расчёта", user.balance)
        try {
          console.log(user.balance, row.userId)
          await db('Users').update({ balance: user.balance }).where({ id: row.userId })
        } catch (e) {
          console.log("ОШИБКА", e)
        }
      } else {
        try {
          await db("CurrentBets").update({ money: 0 }).where({ userId: row.userId })
        } catch (e) {
          console.log("ОШИБКА!!!", e)
        }
      }
    })
  }

  async getResultFromBets(ws, aWs) {
    let arr = await db('CurrentBets')

    arr.forEach(async row => {
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

  async getLastsBets(req, res) {
    return res.json(await db("Lasts").paginate({ perPage: 10, currentPage: 1 }))
  }
}

module.exports = new BetsService()