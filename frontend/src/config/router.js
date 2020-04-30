import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import ArticlesByCategory from '@/components/articles/ArticlesByCategory'
import ArticlesById from '@/components/articles/ArticlesById'
import Auth from '@/components/auth/Auth'

import { userKey } from '@/global'

Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/',
    component: Home
}, {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
    meta: { requiresAdmin: true }
}, {
    name: 'articlesByCategory',
    path: '/categories/:id/articles',
    component: ArticlesByCategory
}, {
    name: 'articlesById',
    path: '/articles/:id',
    component: ArticlesById
}, {
    name: 'auth',
    path: '/auth',
    component: Auth,
    meta: { loginOn: true }
}]

const router = new VueRouter({
    mode: 'history', // hash - fica o # na url, history fica clean
    routes: routes
})

// salvar login do usuario no browser para continuar logado ao sair ou dar refresh
router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if(to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        user && user.admin ? next() : next({ path: '/' })
    } else {
        next()
    }    

    if(to.matched.some(record => record.meta.loginOn)) {
        const user = JSON.parse(json)
        user.name ? next({ path: '/' }) : next()
    } else {
        next()
    }

})



export default router