<template>
    <div class="article-admin">
        <b-form>
            <input type="hidden" id="category.id" v-model="article.id">
           
                <b-col xs="12">

                    <b-form-group label="Nome: " label-for="article-name">
                        <b-form-input id="article-name" type="text" v-model="article.name"
                            required placeholder="Informe o nome do artigo">
                        </b-form-input>
                    </b-form-group>  

                    <b-form-group label="Descrição: " label-for="article-description">
                        <b-form-input id="article-description" type="text" v-model="article.description"
                            required placeholder="Informe a descrição do artigo">
                        </b-form-input>
                    </b-form-group>  

                    <b-form-group label="Imagem (URL): " label-for="article-imageUrl">
                        <b-form-input id="article-imageUrl" type="text" v-model="article.imageUrl"
                            required placeholder="Informe a URL da imgem">
                        </b-form-input>
                    </b-form-group>  

                    <b-form-group label="Categoria: " label-for="article-categoryId">    
                        <b-form-select id="article-categoryId" 
                            :options="categories" v-model="article.categoryId" />                                             
                    </b-form-group>  

                    <b-form-group label="Autor: " label-for="article-userId">    
                        <b-form-select id="article-userId" 
                            :options="users" v-model="article.userId" />                                             
                    </b-form-group>   

                     <b-form-group label="Conteudo: " label-for="article-content">    
                        <VueEditor v-model="article.content"
                            placeholder="Informe o conteúdo do artigo" :disabled="mode === 'remove'"/>                                          
                    </b-form-group>         
                           
                    <b-button v-if="mode === 'save'" @click="save" variant="primary">Salvar</b-button>
                    <b-button v-if="mode === 'remove'" @click="confirmRemove" variant="danger">Excluir</b-button>
                    <b-button @click="reset" variant="secondary" class="ml-2">Cancelar</b-button>

                     <b-link v-if="state === 'excluir'" @click="loadArticle(article, 'remove')" 
                        class="ml-4">{{state}}</b-link>
                    <b-link v-if="state === 'editar'" @click="loadArticle(article)" 
                        class="ml-4">{{state}}</b-link>
                    
                </b-col>           
        </b-form>
        <hr>

    <b-table hover :items="articles" :fields="field">
        <template slot="actions" slot-scope="data">
             <b-button variant="warning" @click="loadArticle(data.item)" class="mr-2" size="sm">
                    <i class="fa fa-pencil"></i>
             </b-button>
             <b-button variant="danger" @click="loadArticle(data.item, 'remove')" class="mr-2" size="sm">
                    <i class="fa fa-trash"></i>
             </b-button>
        </template>
    </b-table>

    <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />

    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'
import { VueEditor } from 'vue2-editor'

export default {
    name: 'ArticleAdmin',
    components: { VueEditor },
    data: function() {
        return {
            mode: 'save',
            state: '',
            article: {},
            articles: [],
            categories: [],
            users: [],
            page: 1,
            limit: 0,
            count: 0,
            field: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'userId', label: 'Autor', sortable: true },
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
        loadArticles() {
            const url = `${baseApiUrl}/articles?page=${this.page}`
            axios.get(url).then(res => {
                
                this.articles = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit               
               
                })
        },
        loadUsers() {
             const url = `${baseApiUrl}/users`
             axios.get(url).then(res => {
                 this.users = res.data.data.map(user => {
                     return { value: user.id, text: `${user.name} - ${user.email}`}
                 })
             })
        },
        save() {
            const method = this.article.id ? 'put' : 'post'
            const id = this.article.id ? `/${this.article.id}` : ''
            axios[method](`${baseApiUrl}/articles${id}`, this.article)   
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        reset() {
            this.mode = 'save'
            this.article = {}
            this.loadArticles()
        },
        remove() {
            axios.delete(`${baseApiUrl}/articles/${this.article.id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(showError)
        },
        loadArticle(article, mode = 'save') {
            this.mode = mode

             axios.get(`${baseApiUrl}/articles/${article.id}`)
                .then(res => this.article = res.data)

            if(this.mode === 'save'){
                this.state = 'excluir'
            } else {
                this.state = 'editar'
            }

        },
        confirmRemove() {     
            let r = confirm("Tem certeza que deseja excluir o artigo?");
            if (r == true) {
                this.remove()
            }       
        }        
    },
    watch: {
        page() {
            this.loadArticles()
        }
    },
    mounted() {
        this.loadCategories()
        this.loadArticles()
        this.loadUsers()
    }
}
</script>    
