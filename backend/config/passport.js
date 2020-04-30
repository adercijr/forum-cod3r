const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    // pega o segredo e o token salvo no navegador do usuario para comparar
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    // fazer a compração
    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(err => done(err, false))
    })

    // aplica o passport
    passport.use(strategy)

    // impedir que as requisições das webservice(api) sejam feitas sem o token valido
    return {
        authenticate: () => passport.authenticate('jwt', { session: false })         
    }
}