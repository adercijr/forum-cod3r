const config = require('../knexfile.js')
const knex = require('knex')(config)

knex.migrate.latest([config]) // tenho que criar as migration antes pelo cmd
module.exports = knex




// -MIGRATION: versão da tabela criada
// 	cmd(novo cmd - fora do cmd do postgres)
// 	knex migrate: make create_table_nomedatable