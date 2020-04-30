module.exports = app => { //app pois usa o consign, para acessar: app.api.validation.nomedafunção

    // função para logar - consultar usuario ja cadastrado para logar (ou pra mais coisas como: categoria, etc)
    function existsOrError (value, msg) {
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg // array vazio tb retorna erro
        if(typeof value === 'string' && !value.trim()) throw msg
    }
    
    // função para criar usuario - consultar se já existi usuario cadastrado
    function notExistsOrError (value, msg) {
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }
    
    //função para comparar senhas, logar o usuario
    function equalsOrError (valueA, valueB, msg) {
        if(valueA !== valueB) throw msg
    }
    
    return { existsOrError, notExistsOrError, equalsOrError }

    //nota: as funções podem ser utilizadas em varios casos, por isso passa os parametros que depende de cada caso.
}


