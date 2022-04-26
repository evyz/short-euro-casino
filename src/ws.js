const db = require('./db/index')

module.exports = async (msg, ws, aWs, states) => {
  let data = JSON.parse(msg)
  switch (data.type) {
    case "bet":
      if (states.stavka === false) {
        ws.send(JSON.stringify({ error: "Время для ставки закончилось" }))
      } else {
        check = await db('CurrentBets').where({ userId: ws.id }).first()
        if (!check) {
          let user = await db('Users').where({ id: ws.id }).first()
          if (user.money < data.money) {
            ws.send("Ваш баланс меньше чем сумма, которую вы хотите поставить")
          }
          else {
            await db.transaction(async (trx) => {
              user.balance = user.balance - data.money

              await trx('Users').update({ balance: user.balance }).where({ id: user.id })
              await trx('CurrentBets').insert({ userId: user.id, money: data.money, bet: data.bet })
            }).then(() => {
              ws.send(JSON.stringify({ text: "Ставка принята" }))
            })
          }
        } else {
          ws.send(JSON.stringify({ error: "Вы уже сделали ставку" }))
        }
      }
      break
    case "balance":
      let obj = await db("Users").where({ id: ws.id }).first()
      ws.send(`ваш баланс ${obj.balance}`)
      break
    case "lasts":
      // let arr = states.lastBets.slice(Math.max(states.lastBets.length - 10, 0))
      // arr.forEach(row =>
      //   ws.send(JSON.stringify(row))
      // )

      ws.send("Сделать функцию!")
      break
  }
}