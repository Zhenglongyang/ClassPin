// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import firebase from 'firebase'
import Login from './pages/Login'
import Register from './pages/Register'
import Tchat from './pages/Tchat'
import store from './store'

//import { LoaderOptionsPlugin } from 'webpack'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/',
    component: Tchat,
    beforeEnter: (to,from,next) =>{
      if(!firebase.auth().currentUser)
      {
        next('/login')
      }
      else{
        next()
      }
    }
  },
]

const router = new VueRouter({routes})

  // Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBQMcvETHcfgQsCez0O3KscPxwWPmAnyFc",
    authDomain: "classpinapp.firebaseapp.com",
    databaseURL: "https://classpinapp.firebaseio.com",
    projectId: "classpinapp",
    storageBucket: "classpinapp.appspot.com",
    messagingSenderId: "1095611313541",
    appId: "1:1095611313541:web:401b6a58e9c2cb770128ec",
    measurementId: "G-NYKLPNGRFJ"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

//var rootRef = firebase.database().ref();
//window.firebase = firebase

const unsubscribe = firebase.auth().onAuthStateChanged(user=>{

  store.dispatch('setUser',user)

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    router,
    store
  })

  unsubscribe()
})
