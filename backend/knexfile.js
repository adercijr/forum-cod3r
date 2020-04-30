const { db } = require('./.env') // para salvar os dados ocultos

module.exports = {

    client: 'postgresql',
    connection: db,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  
};
