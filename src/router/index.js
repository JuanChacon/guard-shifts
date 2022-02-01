import {createRouter,createWebHistory} from 'vue-router';
import Scheduler from '../views/Scheduler.vue';
import EmployeeSchedule from '../views/EmployeeSchedule.vue';
// import store from '../store/index'
const routes = [
    {
       path: '/',
       name: 'Scheduler',
       component: Scheduler  
    },
    {
        path: '/employee/:id/schedule',
        name: 'employee Schedule',
        component: EmployeeSchedule  
     }
]; 
const router = createRouter({
    history: createWebHistory(),
    routes
});

//auth user token

// router.beforeEach((to,from,next)=>{
//     if(to.requiresAuth && store.state.user.token){
//         next({name:'login'})
//     }else if (store.state.user.token && ( to.name === 'Login' || to.name == 'Register')){
//         next();
//     }
// })
export default router;