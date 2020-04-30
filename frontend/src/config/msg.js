//  Configurar o Vue-Toasted
// Mensagem de alerta: sucesso, erro... (animada) https://shakee93.github.io/vue-toasted/

import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3000
})

//criar mensagem padrão de sucesso (default)
Vue.toasted.register(
    'defaultSuccess', // nome
    payload => !payload.msg ?  'Operação realizada com sucesoo!' : payload.msg,
    { type: 'success', icon: 'check' }
)

// criar mensagem padrão de erro
Vue.toasted.register(
    'defaultError',
    payload => !payload.msg ? 'Ops... Erro inesperado!' : payload.msg,
    { type: 'error', icon: 'times' }
)