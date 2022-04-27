module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: "euro-casino",
      user: "postgres",
      password: ""
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    debug: true
  },
};
