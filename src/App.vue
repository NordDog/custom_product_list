<template>
  <v-app>
    <app-header/>
    <app-table/>
    <app-calculator/>
    <v-dialog
      v-model="visible"
      width='70%'
      persistent
    >
      <app-product-list/>
    </v-dialog>
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
    visible(){return this.$store.getters.GET_SHOW_PRODUCT_LIST}
  },
  mounted(){
    this.$store.dispatch('GET_MAIN_TABLE_HEADERS');
    this.$store.dispatch('GET_PRODUCTS_ROWS_AND_DEAL_DATA');
    this.$store.dispatch('GET_PRODUCTS_TREE');
    this.$store.dispatch('GET_PRODUCTS_HEADERS');
  }
};
</script>
