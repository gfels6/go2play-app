import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import routes from './router';

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = false //(TNS_ENV === 'production')

Vue.prototype.$routes = routes;


new Vue({
  render: h => h('frame', [h(App)])
}).$start()
