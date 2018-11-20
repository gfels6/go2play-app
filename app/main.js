import Vue from 'nativescript-vue'
import Start from './components/Start'
import Setup from './components/Setup'
import VueDevtools from 'nativescript-vue-devtools'
import routes from './router';

/* TODO:
     - Localstorage Request if name gesetzt => direkt Main View
     - if not then Start view
*/

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = false //(TNS_ENV === 'production')

Vue.prototype.$routes = routes;


new Vue({
  render: h => h('frame', [h(Start)])
}).$start()
