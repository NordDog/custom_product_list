<template>
  <v-app>
    <div v-if="$root.placement.options.ID > 0">
      <app-header/>
      <app-table/>
      <app-calculator/>
      <v-dialog
        v-model="visible"
        width='95%'
      >
        <app-product-list/>
      </v-dialog>
    </div>
    <div v-else class="closedapp pt-9">
      <h1>Для работы с приложением сохраните </h1>
      <h1 v-if="$root.placement.placement.includes('DEAL')">сделку</h1>
      <h1 v-else>предложение</h1>
    </div>
  </v-app>
</template>

<script>
import appHeader from './components/appHeader';
import appTable from './components/appTable';
import appCalculator from './components/appCalculator';
import appProductList from './components/appProductList';

export default {
  name: 'App',

  components: {
    appHeader,
    appTable,
    appCalculator,
    appProductList
  },

  data(){
    return{

    }
  },
  computed:{
    visible:{
      get(){return this.$store.getters.GET_SHOW_PRODUCT_LIST},
      set(val) {this.$store.dispatch('SET_SHOW_PRODUCT_LIST', val)}
    }
  },
  mounted(){
    this.$store.dispatch('GET_MAIN_TABLE_HEADERS');
    this.$store.dispatch('GET_PRODUCTS_ROWS_AND_DEAL_DATA');
    this.$store.dispatch('GET_PRODUCTS_TREE');
    this.$store.dispatch('GET_PRODUCTS_HEADERS');
  }
};
</script>
<style scoped>
.closedapp{
  text-align: center;
  color: crimson;
}
</style>