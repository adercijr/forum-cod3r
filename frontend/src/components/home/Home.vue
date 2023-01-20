<template>  
    <div class="home">
        <PageTitle icon="fa fa-home" main=" Dashboard" sub="Forum"/>
        <div class="stats">
            <Stat title="Categorias" :value="categories" 
                icon="fa fa-folder" color="#d54d50"/>
            <Stat title="Artigos" :value="articles" 
                icon="fa fa-file" color="#3bc480"/>
            <Stat title="Usuários" :value="users" 
                icon="fa fa-user" color="#3282cd"/>
        </div>
    </div>
</template>

<script>
// AXIOS SERVE PARA FAZER AS REQUISIÇÕES HTTP: GET, POST, PUT, DELETE, ...

import PageTitle from "../template/PageTitle"
import Stat from "./Stat"
import axios from "axios"
import { baseApiUrl } from "@/global"

export default {
  name: "Home",
  components: { PageTitle, Stat },
  data: function() {
    return {
      users: 0,
      articles: 0,
      categories: 0,
      count: 0,
    }
  },
  methods: {
    getStats() {
      // Requisição do backend

      axios.get(`${baseApiUrl}/users`).then((res) => {
        this.users = res.data.count
      })

      axios.get(`${baseApiUrl}/categories/count`).then((res) => {
        this.categories = res.data.count
      })

      axios.get(`${baseApiUrl}/articles`).then((res) => {
        this.articles = res.data.count
      })
    },
  },
  mounted() {
    // faz a requisição de getStats assim que a pagina for carregada
    this.getStats()
  },
}
</script>

<style>
.stats {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* permite que quebre a linha na responsividade */
  align-items: flex-start;
}
</style>
