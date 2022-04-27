exports.up = function (knex) {
  return knex.schema
    .createTable('Users', table => {
      table.increments('id').primary()
      table.string('name').unique()
      table.integer('balance')
    })
    .createTable('Lasts', table => {
      table.increments('id').primary()
      table.integer('number')
      table.timestamp('date')
    })
    .createTable('CurrentBets', table => {
      table.increments('id').primary()
      table.integer('userId').references('id').inTable('Users')
      table.integer('money')
      table.string('bet')
    })
    .createTable('User_Bets', table => {
      table.increments('id').primary()
      table.integer('userId').references('id').inTable('Users')
      table.integer('betsId').references('id').inTable('Lasts')
      table.string('bet')
    })
};


exports.down = function (knex) {
  return knex.schema
    .dropTable('User_Bets')
    .dropTable('CurrentBets')
    .dropTable('Users')
    .dropTable('Lasts')
};
