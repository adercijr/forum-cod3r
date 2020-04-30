const admin  =require('./admin')

module.exports = app => {

    app.post('/signup', app.api.user.save) // increver-se
    app.post('/signin', app.api.auth.signin) // logar
    app.post('/validateToken', app.api.auth.validateToken) // Validar token

    app.route('/users')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .post(admin(app.api.user.save)) // inserir 
        .get(admin(app.api.user.get)) // listar

    app.route('/users/:id')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .put(admin(app.api.user.change)) // alterar
        .get(admin(app.api.user.getById)) // listar pelo ID
        .delete(admin(app.api.user.remove))

    app.route('/categories')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .get(admin(app.api.category.get))
        .post(admin(app.api.category.save))

    // cuidado com a ordem! tem que vir antes de /categories/:id
    app.route('/categories/tree')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .get(app.api.category.getTree)

    app.route('/categories/count')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .get(app.api.category.getCount)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .get(app.api.category.getById)
        .put(admin(app.api.category.save))
        .delete(admin(app.api.category.remove))

    app.route('/articles')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .get(admin(app.api.article.get))
        .post(admin(app.api.article.save))
    
    app.route('/articles/:id')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .get(app.api.article.getById)        
        .put(admin(app.api.article.save))
        .delete(admin(app.api.article.remove))

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate()) // obriga ta logado com token valido
        .get(app.api.article.getByCategory)
    
}

