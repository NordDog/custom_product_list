<template>
  <v-card>
    <v-card-title class="productlistheader pa-0 ma-0">
      <v-btn icon @click="closePList()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <div style="display: flex;height: 90%; max-height:600px;">
      <div class="mwscolumn" :style="treeview ? 'width:20%;min-width:270px;' : 'width: 0px'">
        
        <v-btn 
          icon 
          class="mwsbutton"
          :style="treeview ? 'right: -17px;' : 'right: -27px;'"
          @click="treeview = !treeview"
        >
          <v-icon v-if="treeview">mdi-chevron-left</v-icon>
          <v-icon v-else>mdi-chevron-right</v-icon>
        </v-btn>
        
        <div class="div-table" style="height: 100% !important;">
          <v-treeview
            :hidden='!treeview'
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
            <template v-slot:label="{ item }">
              <v-tooltip right open-delay="700">
                <template v-slot:activator="{ on, attrs }">
                  <span
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{item.NAME}}
                  </span>
                </template>
                <span>{{item.NAME}}</span>
              </v-tooltip>
            </template>
          </v-treeview>
        </div>
      </div>
      <div :style="treeview ? 'width:80%' : 'width:100%'" class="pl-5">
        <v-text-field
          dense
          outlined
          append-icon='mdi-magnify'
          @input="getProds"
          v-model="searchStr"
          class="pr-5"
        ></v-text-field>
        <div class="div-table">
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
                  :src="'https://crm.ms-sibir.com'+file.link" 
                  max-height='40px'
                  max-width='60px'
                  contain
                  @click="showPic('https://crm.ms-sibir.com'+file.link)"
                >
                </v-img>
              </div>
            </template>
            <template v-slot:item.TEXT_DESC="{item}">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-on="on"
                    v-bind="attrs"
                    style="max-height: 60px; overflow: hidden;"
                  >
                    {{item.TEXT_DESC}}
                  </div>
                </template>
                <div style="max-width: 500px">{{item.TEXT_DESC}}</div>
              </v-tooltip>
            </template>
            <template v-slot:item.RABOCHEE_NAIMENOVANIE_04LKHJ="{item}">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-on="on"
                    v-bind="attrs"
                    style="max-height: 60px; overflow: hidden;"
                  >
                    {{item.RABOCHEE_NAIMENOVANIE_04LKHJ}}
                  </div>
                </template>
                <div style="max-width: 500px">{{item.RABOCHEE_NAIMENOVANIE_04LKHJ}}</div>
              </v-tooltip>
            </template>
          </v-data-table>
        </div>

      </div>
    </div>
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
        sect:[],
        treeview: true
      } 
    },
    methods:{
      closePList(){
        this.$store.dispatch('SET_SHOW_PRODUCT_LIST', false)
      },
      getProds: debounce(function (e){

        if(!e) return;

        let options = {
          filter:{'%SEARCHABLE_CONTENT': e},
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
            offset: e.page > 1 ? e.itemsPerPage * e.page : 0,
            order: []
          }
          if(this.sect[0] > 0) options.filter['IBLOCK_SECTION_ID'] = this.sect[0];
          if(e.sortBy.length > 0) 
            options.order = {[e.sortBy[0]] : e.sortDesc[0] ? 'DESC' : 'ASC'};
        } else {
          options = {
            filter:{'IBLOCK_SECTION_ID': e[0]},
            limit: this.options.itemsPerPage,
            offset: this.options.page > 1 ? this.options.itemsPerPage * this.options.page : 0,
            order: []
          }
          if(this.options.sortBy.length > 0) 
            options.order = {[this.options.sortBy[0]] : this.options.sortDesc[0] ? 'DESC' : 'ASC'};
        }
        if(this.searchStr) options.filter['%NAME'] = this.searchStr;
        BX24.callMethod('mws.products.list', options, res=>{
          this.products = res.data().rows;
          this.total = res.answer.total;
        })
      },
      addProduct(event, row){

        let newRow = {
          AUCTION: 0,
          DESCRIPTION_AREA: row.item.DESCRIPTION,
          ID_ROW: 0,
          PROD_IMGS: row.item.FILES,
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
          ROW_PRODUCT_ID: row.item.ID,
          ROW_PRODUCT_NAME: row.item.NAME,
          ROW_QUANTITY: 1,
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
<style>
.productlistheader{
  display: flex;
  justify-content: end;
}
.div-table{
  overflow: auto; 
  height: 80%;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.div-table::-webkit-scrollbar {
  display: none;
}
.mwsbutton{
  position: absolute;
  bottom: 50%;
  z-index: 10;
  background-color: white;
}
.mwscolumn{
  border-right: 1px solid black;
  position: relative;
}
.mws-headers{
  vertical-align: baseline !important;
}
</style>