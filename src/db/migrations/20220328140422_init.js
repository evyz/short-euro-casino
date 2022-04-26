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
      table.date('date')
    })
    .createTable('CurrentBets', table => {
      table.increments('id').primary()
      table.integer('userId').references('id').inTable('Users')
      table.integer('money')
      table.string('bet')
    })
};


exports.down = function (knex) {
  return knex.schema
    .dropTable('CurrentBets')
    .dropTable('Users')
    .dropTable('Lasts')
};
