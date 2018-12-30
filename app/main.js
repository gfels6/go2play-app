import Vue from 'nativescript-vue'
import Start from './components/Start'
import Setup from './components/Setup'
import Main from './components/Main'
import VueDevtools from 'nativescript-vue-devtools'
import routes from './router'

require( "nativescript-localstorage" );
// !!!!! run next line to clear name in localStorage !!!!!
//localStorage.clear();

import HelperService from '@/services/HelperService'
const helperService = new HelperService()

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = false //(TNS_ENV === 'production')

// Adding all routes globally
Vue.prototype.$routes = routes;

/* 
  Checking if it is already a name in the local Storage
  If it is so, then go directly to the Main view
  If not then go to the start view  
*/
let hasName;
hasName = helperService.checkForName();

new Vue({
  render: h => h('frame', [h(hasName ? Main : Start)])
}).$start()
