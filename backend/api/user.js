const bcrypt = require('bcrypt-nodejs') //criptografar senha 

module.exports = app => {
    //importar as funções de validação
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    //função para criptografar senha - ainda não chamada!
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }


    const save = async (req, res) => {
        //pega os dados do bodyParser(dados do usario transmitido de um formulario)
        const user = {...req.body} 
        //pega os dados do bodyParser(formulario) como não vai ter o id no formulario ele cria um pelo id da URL
        if(req.params.id) user.id = req.params.id // parametro id na URL
        
        // IMPEDIR QUE NÃO ADMIN CADASTRA OUTRO USUARIO COM ADMIN
        //só pode cadastrar admin se for pelo /users e não pelo /signup
        if(!req.originalUrl.startsWith('/users')) user.admin = false
        // se o usuario nao tiver logado ou tiver admin como false
        if(!req.user || !req.user.admin) user.admin = false

        // --------- serie de erros ao cadastrar -------------
        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            //compara o email informado com o do servidor (não salva no banco ainda, so da erro se o tiver!)
            const userFromDB = await app.db('users')
                .where({ email: user.email }) // campo email do BD = user.email ??
                .first() // para pegar o elemento objeto e não o objeto dentro de um array - nao faz sentido ja q é apenas 1
            if(!user.id) { //se não tem id é porque está cadastrando um novo ususario
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
        //deleta o campo de confirmar senha para não inserir no banco de dados
        user.password = encryptPassword(req.body.password)
        delete user.confirmPassword

        //------------- inserindo dados no servidor ----------
        if(user.id) { // se tem id é pq ta atualizando dados de um ususario existente
            app.db('users')
                .update(user) // todas info novas
                .where({ id: user.id }) // id do Banco de dados = id da requisição?
                .whereNull('deletedAt')
                .then(_ => res.status(204).send()) // deu tudo certo!
                .catch(err => res.status(500).send(err)) // deu erro no servidor!
        } else { // não tem id - está criando um novo usario ID
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

   

    const change = async (req, res) => {
        //pega os dados do bodyParser(dados do usario transmitido de um formulario)
        const user = {...req.body} 
        //pega os dados do bodyParser(formulario) como não vai ter o id no formulario ele cria um pelo id da URL
        if(req.params.id) user.id = req.params.id // parametro id na URL
        
        // IMPEDIR QUE NÃO ADMIN CADASTRA OUTRO USUARIO COM ADMIN
        
        // se o usuario nao tiver logado ou tiver admin como false
        if(!req.user || !req.user.admin) user.admin = false

        // --------- serie de erros ao cadastrar -------------
        try {
            
            if(user.password) {
                existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
                equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')
            }
            //compara o email informado com o do servidor (não salva no banco ainda, so da erro se o tiver!)
            const userFromDB = await app.db('users')
                .where({ email: user.email }) // campo email do BD = user.email ??
                .first() // para pegar o elemento objeto e não o objeto dentro de um array - nao faz sentido ja q é apenas 1
            if(!user.id) { //se não tem id é porque está cadastrando um novo ususario
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
        //deleta o campo de confirmar senha para não inserir no banco de dados
        user.password = encryptPassword(req.body.password)
        delete user.confirmPassword

        //------------- inserindo dados no servidor ----------
        if(user.id) { // se tem id é pq ta atualizando dados de um ususario existente
            app.db('users')
                .update(user) // todas info novas
                .where({ id: user.id }) // id do Banco de dados = id da requisição?
                .whereNull('deletedAt')
                .then(_ => res.status(204).send()) // deu tudo certo!
                .catch(err => res.status(500).send(err)) // deu erro no servidor!
        }

    }


    // --------- PEGAR (LISTAR) TODOS USUÁRIOS DO SISTEMA'COM PAGINADOR'!!!----------
    const limit = 10

    const get = async (req, res) => {
        const page = req.query.page || 1
        //consulta a quantidade de usauario no BD
        const result = await app.db('users').whereNull('deletedAt').count('id').first()
        const count = parseInt(result.count)

        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .limit(limit)
            .offset(page * limit - limit)
            .then(users => res.json({ data: users, limit, count}))
            .catch(err => res.status(500).send(err))
    }

    // --------- PEGAR USUARIO POR ID --------------
    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first() // pegar o objeto sem array
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    // DELETAR USUARIO SOFT (MANTEM O USARIO NO BD MAS ATRAVES DA COLUNA DELETED SABE Q FOI DELETADO)
    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            notExistsOrError(articles, 'Usuário possui artigos')

            // colocando data o usuario passa a ter status de deletado
            const rowsUpdated = await app.db('users')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove, change }
}