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
  access_token: "13c8f062005c2ea6005a870200000001000007519c9f3d524608d9d1edca22fcb8cae7",
  domain: "crm.ms-sibir.com",
  expires_in: 1659947026298,
  member_id: "800f1ebe29b5b5a6a322820ef31d95db",
  refresh_token: "03471863005c2ea6005a8702000000010000079254ff0c15fad125cb8b377139bd0563",

  placement: "CRM_DEAL_DETAIL_TAB",//CRM_QUOTE_DETAIL_TAB
  placement_options: {
    ID: 7
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