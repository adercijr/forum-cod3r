import Vue from 'vue'

export const baseApiUrl = 'http://localhost:3000'

export const userKey = '__Knowledge_user'

// Setar as mensagens de erros - catch() no backend

export function showError(e) {    
    // erro default criado no config/msg
    if(e && e.response && e.response.data) {
        Vue.toasted.global.defaultError({ msg : e.response.data })
    } else if(typeof e === 'string') {
        Vue.toasted.global.defaultError({ msg : e })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, showError, userKey }
