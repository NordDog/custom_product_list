import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import BX24 from './bitrix24-rest.js'//TODO: don't forget comment it!!!
import './bitrix24-complexBatch.js'
import store from './store'

Vue.config.productionTip = false

if(BX24 && typeof BX24.initAuth == "function") BX24.initAuth({
  client_id: "local.62b3f4cb0af6d6.81176258",
  client_secret: "27mFz8dnyWIsTv2ggt26WV3N32n7gKXoPbQZfoZA2bRVmqczBm",
  access_token: "3a6ac562005c2ea6005a87020000000100000705dafb5f82beae497ff0a163fd9521cd",
  domain: "crm.ms-sibir.com",
  expires_in: 1657104953190,
  member_id: "800f1ebe29b5b5a6a322820ef31d95db",
  refresh_token: "2ae9ec62005c2ea6005a8702000000010000075c0ef2b5d3f402ba42f0806211bbbece",

  placement: "CRM_DEAL_DETAIL_TAB",
  placement_options: {
    ID: 7//75950
  }
});
BX24.init(()=>{
  var inf = BX24.placement.info();
  const app = new Vue({
    data(){
      return{
        placement: inf,
      }
    },
    vuetify,
    store,
    render: h => h(App)
  });
  store.$app = app;
  app.$mount('#app');
})