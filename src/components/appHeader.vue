<template>
  <div class="app-header">
    <div>
      <v-btn color='#3bc8f5' dark class="mr-3" @click="addPRow">Добавить товар</v-btn>
      <v-btn outlined @click='showPList()'>Выбрать товар</v-btn>
    </div>
    <div style="display: flex">
      <v-text-field
        dense
        outlined
        min='0'
        label="Затраты на логистику"
        suffix="₽"
        class="mr-3"
        type='number'
        hide-details
        v-model="total_logistic"
      ></v-text-field>
      <v-text-field
        dense
        outlined
        min='0'
        suffix="₽"
        label="затраты на аукцион"
        type='number'
        hide-details
        v-model="total_auction"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'appHeader',

    data(){
      return{
        items:[
          {
            name:'первый',
            val:'1'
          },
          {
            name:'второй',
            val:'2'
          },
          {
            name:'третий',
            val:'3'
          },
          {
            name:'четвертый',
            val:'4'
          }
        ],
      }
    },
    computed:{
      total_logistic:{
        get(){return this.$store.getters.GET_TOTAL_LOGISTIC},
        set(val){this.$store.dispatch('SET_TOTAL_LOGISTIC', val)}
      },
      total_auction:{
        get(){return this.$store.getters.GET_TOTAL_AUCTION},
        set(val){this.$store.dispatch('SET_TOTAL_AUCTION', val)}
      }
    },
    methods:{
      showPList(){
        this.$store.dispatch('SET_SHOW_PRODUCT_LIST', true);
      },
      addPRow(){
        let newRow = {
          AUCTION: 0,
          DESCRIPTION_AREA: 0,
          ID_ROW: 0,
          IMAGE: [],
          LOGISTIC: 0,
          NEED_COUNT: 0,
          NEED_COUNT_OLD: 0,
          OVERPRICE: 0,
          PURCH_PRICE: 0,
          ROW_DISCOUNT_SUM:  0,
          ROW_ID: 0,
          ROW_PRICE: 0,
          ROW_PRICE_ACCOUNT: 0,
          ROW_PRICE_BRUTTO: 0,
          ROW_PRICE_EXCLUSIVE: 0,
          ROW_PRICE_NETTO: 0,
          ROW_PRODUCT_ID: 0,
          ROW_PRODUCT_NAME: '',
          ROW_QUANTITY: 0,
          ROW_SORT: 0,
          RRC: 0,
        }
        this.$store.dispatch('ADD_PRODUCT_ROW', newRow);
      },
    }
  }
</script>
<style scoped>
.app-header{
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>