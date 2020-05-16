import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'
import { firestorePlugin } from 'vuefire'
import router from './router/index'
import { keyFirebase } from '@/credentials/credentials'

Vue.config.productionTip = false

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: keyFirebase,
  authDomain: "fabrica-memes-a7f72.firebaseapp.com",
  databaseURL: "https://fabrica-memes-a7f72.firebaseio.com",
  projectId: "fabrica-memes-a7f72",
  storageBucket: "fabrica-memes-a7f72.appspot.com",
  messagingSenderId: "26830875393",
  appId: "1:26830875393:web:628432a8ffb48a6f290900",
  measurementId: "G-V7JN6FMZLH"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore()  // Acceso a la base de datos
export const storage = firebase.storage().ref('/images') 

Vue.use(firestorePlugin)

new Vue({
  vuetify,
  render: h => h(App),
  router,
  components: { App }
}).$mount('#app')
