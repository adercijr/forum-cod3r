<template>
    <div class="user-admin" id="teste">
        <b-form>
            <input id="user-id" type="hidden" v-model="user.id">
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Nome: " label-for="user-name">
                        <b-form-input id="user-name" type="text" v-model="user.name" 
                            required placeholder="Informe o nome do usuário" 
                            :readonly="mode === 'remove'" >
                        </b-form-input>
                    </b-form-group>                    
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Email: " label-for="user-email">
                        <b-form-input id="user-email" type="text" v-model="user.email"
                            required placeholder="Informe o email do usuário"
                            :readonly="mode === 'remove'" >
                        </b-form-input>
                    </b-form-group>                    
                </b-col>
            </b-row>

            <b-form-checkbox id="user-admin" v-model="user.admin" class="mt-3 mb-3"
                 :readonly="mode === 'remove'">
                Administrador ?
            </b-form-checkbox>

            <b-row v-show="mode === 'save'">
                <b-col md="6" sm="12">
                    <b-form-group label="Senha: " label-for="user-password">
                        <b-form-input id="user-password" type="password" v-model="user.password"
                            required placeholder="Informe a senha do usuário" >
                        </b-form-input>
                    </b-form-group>                    
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Confirmação de senha: " label-for="user-confirmPassword">
                        <b-form-input id="user-confirmPassword" type="password" v-model="user.confirmPassword"
                            required placeholder="Confirme a senha do usuário" >
                        </b-form-input>
                    </b-form-group>                    
                </b-col>
            </b-row>

            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode === 'save'" @click="save" >Salvar</b-button>
                    <b-button variant="danger" v-if="mode === 'remove'" @click="confirmRemove" >Excluir</b-button>
                    <b-button class="ml-2" @click="reset" >Cancelar</b-button>
                   

                    <b-link v-if="state === 'excluir'" @click="loadUser(user, 'remove')" 
                        class="ml-4">{{state}}</b-link>
                    <b-link v-if="state === 'editar'" @click="loadUser(user)" 
                        class="ml-4">{{state}}</b-link>
                </b-col>                
            </b-row>

        </b-form>

        <hr>

        <b-table hover :items="users" :fields="fields">
            <!-- coloca botoes remover/alterar na lista de usarios -->
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="scrollTop(), loadUser(data.item)" 
                    class="mr-2" size="sm">
                        <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="scrollTop(), loadUser(data.item, 'remove')"
                     class="mr-2" size="sm">
                        <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>

        <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
    
export default {
    name: 'UserAdmin',
    data: function() {
        return {
            mode: 'save',
            state: '',
            user: {},
            users: [],
            page: 1,
            count: 0,
            limit: 0,
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'email', label: 'E-mail', sortable: true },
                { key: 'admin', label: 'Administrador', sortable: true, 
                    formatter: value => value ? 'Sim' : 'Não' },
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        loadUsers() {
            const url = `${baseApiUrl}/users?page=${this.page}`
            axios.get(url).then(res => {

                this.users = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit  
                })            
        },
        reset() {
            this.mode = 'save'
            this.user = {}
            this.state= ''
            this.loadUsers()
        },
        save() { // inserir ou alterar
            const method = this.user.id ? 'put' : 'post'
            const id = this.user.id ? `/${this.user.id}` : ''
            axios[method](`${baseApiUrl}/users${id}`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.user.id
            axios.delete(`${baseApiUrl}/users/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadUser(user, mode = 'save') {
            this.mode = mode
            this.user = { ...user }
            if(this.mode === 'save') {
                this.state = 'excluir'
            } else {
                this.state = 'editar'
            }
        },
        scrollTop() { // mover pra cima - com jQuery
                 $('html, body').animate({ scrollTop: 200 }, 50); 
                  
        },
        confirmRemove() {     
            let r = confirm("Tem certeza que deseja excluir usuário?");
            if (r == true) {
                this.remove()
            }       
        }        
    },
    watch: {
        page() {
            this.loadUsers()
        }
    },        
    mounted() {
        this.loadUsers()
    }
}
</script>
    
<style>

</style>