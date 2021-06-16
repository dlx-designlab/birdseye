import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import vueCountryRegionSelect from 'vue-country-region-select';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  en: require('./translations/en.json'),
  jp: require('./translations/jp.json')
}

Vue.use(vueCountryRegionSelect);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAJk2P8zdqqutGbF7IxaSH325OAGjgF71k',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
 
  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,
 
  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})

Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'en',
  messages
})

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')
