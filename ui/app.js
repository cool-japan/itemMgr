const routes=[
    {path:'/home',component:home},
    {path:'/item',component:item},
    {path:'/company',component:company}
]

const router=new VueRouter({
    routes
})

const app = new Vue({
    router
}).$mount('#app')
