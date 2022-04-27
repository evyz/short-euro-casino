const db = require('./db/index')

class UserService {
  async register(req, res) {
    const { name } = req.body

    let check = await db('Users').where({ name }).first()
    if (check) {
      return res.json({ error: "Пользователь с таким именем уже существует" })
    }

    return res.json(
      await
        db('Users')
          .insert({ name, balance: 10000 })
          .then(async () => {
            return await db('Users').where({ name }).first()
          })
    )
  }

  async confirm(name) {
    let check = await db('Users').where({ name }).first()
    if (!check) {
      return false
    }

    return true
  }

  async me(name) {
    return await db('Users').where({ name }).first()
  }

}

module.exports = new UserService()