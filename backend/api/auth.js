// -------- LOGIN: AUTENTICAÇÃO DO USUARIO -------------

const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    // não preenche os campos email ou senha
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Enter username and password!')
        }
        // consulta no bd pelo email informado se o usuario existe
        const user = await app.db('users')
            .where({ email: req.body.email })
            .whereNull('deletedAt')
            .first()
        if (!user) return res.status(400).send('User not found!')

        // comparar senha informada com a do bd
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(401).send('Invalid Email/Password!')

        // setar tempo do token para funcionar
        // date.now = milisegundos desde 1970 ate o momento
        const now = Math.floor(Date.now() / 1000 ) // floor para arredondar e /1000 para segundos

        const dateValidateToken = (60 * 60 * 24 * 7) 

        const expToken = now + dateValidateToken       

        //SIGNIN - conteudo do token
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now, // nome padrao =  seta quando vai ser gerado o token
            exp: expToken
        }

        // gera o token atraves dos dados e do segredo
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    // validar token 
    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            // pega o token no navegador do usuario
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true) // ------------------------ SUBSTITUI TRUE PARA RENOVAR O TOKEN--------------------
                }
            }
        } catch(e) {
            // problema com o token
        }
        res.send(false)
    }
    
    return { signin, validateToken }
}