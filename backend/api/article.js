const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const article = { ...req.body } // dados do formulario
        if(req.params.id) article.id = req.params.id //pega id da url e coloca no formulario

        // testar formulario
        try {
            existsOrError(article.name, 'Article name not informed')
            existsOrError(article.description, 'Item description not provided')
            existsOrError(article.categoryId, 'Article category not informed')
            existsOrError(article.userId, 'Article author unknown')
            existsOrError(article.content, 'Undisclosed article content')
        } catch(msg) {
            res.status(400).send(msg)
        }

        // atualizar artigo existente
        if(article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else { // incluir novo artigo
            app.db('articles')
                .insert(article)                
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')
            .where({ id: req.params.id })
            .del()

            try {
               existsOrError(rowsDeleted, 'Article not found')
            }catch(msg) {
                return res.status(400).send(msg)
            }

                res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    } 

    // ------------ PAGINADOR DE ARTIGOS --------------
    const limit = 5

    const get = async (req, res) => {
        const page = req.query.page || 1
        // pegando a qtda de articles no BD para gerar a qtd de paginas
        const result = await app.db('articles').count('id').first() // apenas 1 array de articles, nao faz sentido
        const count = parseInt(result.count) // count vem como string

        app.db('articles')
            .select('id', 'name', 'description', 'userId')
            .limit(limit)
            //qual vai ser o primeiro elemento de cada pagina
            .offset(page * limit - limit)
            // já passa count e limit pro front montar o paginador
            .then(articles => res.json({ data: articles, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    // retornar artigo por ID
    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    // filro dos artigos
    const getByCategory = async (req, res) => {
        const result = await app.db('articles').count('id').first() // apenas 1 array de articles, nao faz sentido
        const count = parseInt(result.count) // count vem como string

        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then(articles => res.json({data: articles, limit, count}))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}