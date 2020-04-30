// apos o token expirar dar uma refresh para refazer o login
import axios from 'axios'

const success = res => res

const error = err => {
    //se o erro for 401 atualiza para a pagina inicial
    // não valido na tela de login
    if(401 === err.response.status && !window.location.pathname.includes('auth')) {
        window.location = '/'
    } else {
        //caso contrario rejeita = nao faça nada
        return Promise.reject(err)
    }
}

// intercepta usando success ou error
axios.interceptors.response.use(success, error)