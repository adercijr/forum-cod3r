const app = require('express')() // juntando 2 chamadas: express e o chamando dentro de app
const consign = require('consign')
const db = require('./config/db')

app.db = db

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

var porta = process.env.PORT || 3000;
app.listen(porta, () => {
    console.log('Backend executando...')
})
