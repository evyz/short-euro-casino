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
      let user = await db('Users').where({ id: row.userId }).first()
      let resultBet = await bid(row.bet, row.money, states.number, null, user.id)

      if (resultBet.finalMoney > 0) {
        user.balance = user.balance + resultBet.finalMoney
        await db('Users').update({ balance: user.balance }).where({ id: row.userId })
      } else {
        await db("CurrentBets").update({ money: 0 }).where({ userId: row.userId })
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