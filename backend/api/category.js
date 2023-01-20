module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    // incluir ou alterar categoria
    const save = (req, res) => {
        const category = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }
        //pega os dados do bodyParser(formulario) 
        //como não vai ter o id no formulario ele cria um no formulario pelo id da URL
        if(req.params.id) category.id = req.params.id // params === URL

        try {
            existsOrError(category.name, 'Uninformed category')
        } catch(msg) {
            return res.status(400).send(msg)
        }
        // atualizar categoria se já existir
        if(category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        // como não existi categoria cria-se uma       
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // remover categoria - se tiver associada a um artigo ou a outra categoria NÃO PODE REMOVER
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Category Code not informed.')

            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id })
            notExistsOrError(subcategory, 'Category has subcategories.')

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Category has articles.')

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Category not found.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }



    // criar caminhos(relação pai-filho) das categorias
    // vai receber as categorias e retornar as categorias relacionadas
    const withPath = categories => {
        // pega o pai da categoria
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null // existi um pai da categoria? se sim retorna o pai dela
        }
        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId) 

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }
            return { ...category, path }
        })

        // ordem as categorias em ordem alfabética
        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })
        return categoriesWithPath
    }

    //retornar as categorias paginadas - isso que estarta td acima
    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }
    
    const getCount = async (req, res) => {

            const result = await app.db('categories').count('id').first()
            const count = parseInt(result.count)

            app.db('categories')
                .then(categories => res.json({categories, count}))
                .catch(err => res.status(500).send(err))

    }
        

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    // criar arvore no menú lateral
    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId) // gera a primeira arvore
        // tree = pai (topo da arvore)
        // cada map salva o resultado dentro da constante 'parentNode' 
        // parentNode no primeiro map é o PAI, NO SEGUNDO FILHO, TERCEITO NETO....
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }
    // starta a arvore
    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree, getCount }
}