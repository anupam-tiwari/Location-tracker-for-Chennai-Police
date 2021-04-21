// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import * as firebase from 'firebase/app'


Vue.config.productionTip = false




// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBW30L3gNGUEHeTmK6kPDnYNYWfFjFo0oo",
  authDomain: "srmtracker-b9740.firebaseapp.com",
  projectId: "srmtracker-b9740",
  storageBucket: "srmtracker-b9740.appspot.com",
  messagingSenderId: "60099038412",
  appId: "1:60099038412:web:7c28be2889159e53b54669",
  measurementId: "G-DT09HFGB0D"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
