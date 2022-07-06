<template>
  <v-card>
    <v-card-title class="productlistheader pa-0 ma-0">
      <v-btn icon @click="closePList()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text style="display: flex;">
      <div style="border-right: 1px solid black; width: 20%">
        <v-treeview
          :items='tree'
          item-text='NAME'
          :active.sync='sect'
          activatable
          item-key='ID'
          @update:active='getProducts'
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.file">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
          </template>
        </v-treeview>
      </div>
      <div style="width: 80%;" class="px-5">
        <v-text-field
          dense
          outlined
          append-icon='mdi-magnify'
          @input="getProds"
          v-model="searchStr"
        ></v-text-field>
        <v-data-table
          :headers='headers'
          :items='products'
          :server-items-length="total"
          :footer-props="{
            showFirstLastPage: true,
            itemsPerPageAllText: 'Все',
            itemsPerPageOptions: [20, 50, 100, -1],
          }"
          @update:options='getProducts'
          @dblclick:row="addProduct"
          :options.sync="options"
        >
          <template v-slot:item.MORE_PHOTO="{item}">
            <div style="display: flex;">
              <v-img 
                style="cursor: pointer;"
                v-for="(file, index) in item.FILES" 
                :key="index" 
                :src="'https://crm.ms-sibir.com/'+file.link" 
                max-height='40px'
                max-width='60px'
                contain
                @click="showPic('https://crm.ms-sibir.com/'+file.link)"
              >
              </v-img>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
  import debounce from 'debounce';
  export default {
    name: 'appProductList',

    data(){
      return{
        tree:[],
        headers:[],
        products:[],
        total:0,
        options:{},
        searchStr: '',
        sect:[]
      } 
    },
    methods:{
      closePList(){
        this.$store.dispatch('SET_SHOW_PRODUCT_LIST', false)
      },
      getProds: debounce(function (e){

        if(!e) return;

        let options = {
          filter:{'%NAME': e},
          limit:this.options.itemsPerPage
        }

        BX24.callMethod('mws.products.list', options, res=>{
          this.products = res.data().rows;
          this.total = res.answer.total;
        })

      }, 1000),
      getProducts(e){
        let options = {} 
        if(e.page){
          options = {
            filter:{},
            limit: e.itemsPerPage,
            offset: e.itemsPerPage * e.page
          }
          if(this.sect[0] > 0) options.filter['IBLOCK_SECTION_ID'] = this.sect[0];
        } else {
          options = {
            filter:{'IBLOCK_SECTION_ID': e[0]},
            limit: this.options.itemsPerPage,
            offset: this.options.itemsPerPage * this.options.page
          }
        }
        if(this.searchStr) options.filter['%NAME'] = this.searchStr;
        BX24.callMethod('mws.products.list', options, res=>{
          this.products = res.data().rows;
          this.total = res.answer.total;
        })
      },
      addProduct(event, row){
        console.log(row.item)

        let newRow = {
          AUCTION: 0,
          DESCRIPTION_AREA: 0,
          ID_ROW: 0,
          IMAGE: row.item.PICS,
          LOGISTIC: 0,
          NEED_COUNT: 0,
          OVERPRICE: 0,
          PURCH_PRICE: 0,
          ROW_DISCOUNT_SUM:  0,
          ROW_ID: 0,
          ROW_PRICE: 0,
          ROW_PRICE_ACCOUNT: 0,
          ROW_PRICE_BRUTTO: 0,
          ROW_PRICE_EXCLUSIVE: 0,
          ROW_PRICE_NETTO: 0,
          ROW_PRODUCT_ID: row.item.ID,
          ROW_PRODUCT_NAME: row.item.NAME,
          ROW_QUANTITY: 0,
          ROW_SORT: 0,
          RRC: 0,
        };

        this.$store.dispatch('ADD_PRODUCT_ROW', newRow);

      },
      showPic(url){
        window.open(url);
      }
    },
    mounted(){
      this.tree = this.$store.getters.GET_PRODUCTS_TREE;
      this.headers = this.$store.getters.GET_PRODUCTS_HEADERS;
    }
  }
</script>
<style scoped>
.productlistheader{
  display: flex;
  justify-content: end;
}
</style>