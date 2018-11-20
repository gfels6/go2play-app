import Vue from 'nativescript-vue'
import Start from './components/Start'
import Setup from './components/Setup'
import Main from './components/Main'
import VueDevtools from 'nativescript-vue-devtools'
import routes from './router'

require( "nativescript-localstorage" );

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = false //(TNS_ENV === 'production')

Vue.prototype.$routes = routes;

// !!!!! run next line to clear name in localStorage !!!!!
//localStorage.clear();

// ugly, please do beautify :)
let name = localStorage.getItem('name') || false;
console.log("local user?: " + name);
let hasName;
if(name != false){
  hasName = true;
} else {
  hasName = false;
}

// if it has name im localStorage, go directly to Main
new Vue({
  render: h => h('frame', [h(hasName ? Main : Start)])
}).$start()
