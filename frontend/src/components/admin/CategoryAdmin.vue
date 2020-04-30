<template>
    <div class="category-admin">
        <b-form>
            <input type="hidden" id="category.id" v-model="category.id">
           
                <b-col xs="12">
                    <b-form-group label="Nome: " label-for="category-name">
                        <b-form-input id="category-name" type="text" v-model="category.name"
                            required placeholder="Informe o nome do artigo">
                        </b-form-input>
                    </b-form-group>          
                                         
                    <b-form-group label="Categoria pai: " label-for="category-parentId">    
                        <b-form-select id="category-parentId" 
                            :options="categories" v-model="category.parentId" />                                             
                    </b-form-group>              
                               
                    <b-button v-if="mode === 'save'" @click="save" variant="primary">Salvar</b-button>
                    <b-button v-if="mode === 'remove'" @click="confirmRemove" variant="danger">Excluir</b-button>
                    <b-button @click="reset" variant="secondary" class="ml-2">Cancelar</b-button>

                    <b-link v-if="state === 'excluir'" @click="loadCategory(category, 'remove')" 
                        class="ml-4">{{state}}</b-link>
                    <b-link v-if="state === 'editar'" @click="loadCategory(category)" 
                        class="ml-4">{{state}}</b-link>
                </b-col>           
        </b-form>
        <hr>

    <b-table hover :items="categories" :fields="field">
        <template slot="actions" slot-scope="data">
             <b-button variant="warning" @click="scrollTop(), loadCategory(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
             </b-button>
             <b-button variant="danger" @click="scrollTop(), loadCategory(data.item, 'remove')" class="mr-2">
                    <i class="fa fa-trash"></i>
             </b-button>
        </template>
    </b-table>

    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'

export default {
    name: 'CategoryAdmin',
    data: function() {
        return {
            mode: 'save',
            state: '',
            category: {},
            categories: [],
            field: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'path', label: 'Caminho', sortable: true },
                { key: 'actions', label: 'Ações'}
            ]
        }
    },
    methods: {
        loadCategories() {
            const url = `${baseApiUrl}/categories`
            axios.get(url).then(res => {
                //this.categories = res.data
                 this.categories = res.data.map(category => {
                    return { ...category, 
                    value: category.id, 
                    text: category.path }                   
                })
            })
        },
        save() {
            const method = this.category.id ? 'put' : 'post'
            const id = this.category.id ? `/${this.category.id}` : ''
            axios[method](`${baseApiUrl}/categories${id}`, this.category)   
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        reset() {
            this.mode = 'save'
            this.category = {}
            this.loadCategories()
            this.state = ''
        },
        remove() {
            axios.delete(`${baseApiUrl}/categories/${this.category.id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(showError)
        },
        loadCategory(category, mode = 'save') {
            this.mode = mode
            this.category = { 
                id: category.id,
                name: category.name,
                parentId: category.parentId
             }

            if(this.mode === 'save'){
                this.state = 'excluir'
            } else {
                this.state = 'editar'
            }

        },
        scrollTop() { // mover pra cima - com jQuery
                 $('html, body').animate({ scrollTop: 200 }, 50);                   
        },
        confirmRemove() {     
            let r = confirm("Tem certeza que deseja excluir categoria?");
            if (r == true) {
                this.remove()
            }       
        }        
    },
    mounted() {
        this.loadCategories()
    }
}
</script>
    
<style>

</style>