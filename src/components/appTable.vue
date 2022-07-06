<template>
  <div>
    <v-data-table
      :headers='headers'
      hide-default-footer
      :items='rows'
      item-key='ID_ROW'
      show-expand
      single-expand
      :expanded.sync="expanded"
    >
      
      <template v-slot:item.ROW_PRODUCT_NAME="{item}">
        <v-autocomplete
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.ROW_PRODUCT_NAME"
          placeholder='Наименование товара'
          :search-input.sync="item.search"
          :items='products'
          item-text='NAME'
          item-value='NAME'
          @change="update(item)"
          @update:search-input='()=>{getProds(item), setName2arr(item)}'
          :ref="'nameinput_'+item.ID_ROW"
        >
          <template v-slot:append-item>
            <div v-if='showAdder' class="createItem" @click="createNewProduct(item)">
              <v-icon color='#3bc8f5'>mdi-plus-circle</v-icon>
              <span>Создать</span>
            </div>
          </template>
          <template v-slot:append-outer>
            <v-btn v-if="item.ROW_PRODUCT_ID > 0" style="margin-top: -7px;" icon><v-icon>mdi-arrow-right</v-icon></v-btn>
          </template>
          <template v-slot:prepend-inner>
            <v-icon color='#3bc8f5' v-if="item.newProd">mdi-new-box</v-icon>
          </template>
        </v-autocomplete>
      </template>

      <template v-slot:item.data-table-expand="{item}">
        <v-switch
          title="Включите чтобы добавить описание и изображения к товару"
          v-model="item.expand"
          @change="expandItem(item)"
        ></v-switch>
      </template>
      <template v-slot:item.ROW_QUANTITY="{item}">
        <v-text-field
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.ROW_QUANTITY"
          type='number'
          suffix='шт'
          placeholder='0'
          @input="calculater(item)"
          min='0'
        ></v-text-field>
      </template>
      <template v-slot:item.PURCH_PRICE="{item}">
        <v-text-field
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.PURCH_PRICE"
          type='number'
          suffix="₽"
          placeholder='0'
          @input="calculater(item)"
          min='0'
        ></v-text-field>
      </template>
      <template v-slot:item.RRC="{item}">
        <v-text-field
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.RRC"
          type='number'
          suffix="₽"
          placeholder='0'
          @input="calculater(item)"
          min='0'
        ></v-text-field>
      </template>
      <template v-slot:item.OVERPRICE="{item}">
        <v-text-field
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.OVERPRICE"
          type='number'
          suffix="₽"
          placeholder='0'
          @input="calculater(item)"
          min='0'
        ></v-text-field>
      </template>
      <template v-slot:item.LOGISTIC="{item}">
        <v-text-field
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.LOGISTIC"
          type='number'
          suffix="₽"
          placeholder='0'
          @input="calculater(item)"
          min='0'
        ></v-text-field>
      </template>
      <template v-slot:item.AUCTION="{item}">
        <v-text-field
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.AUCTION"
          type='number'
          suffix="₽"
          placeholder='0'
          @input="calculater(item)"
          min='0'
        ></v-text-field>
      </template>
      <template v-slot:item.ROW_DISCOUNT_SUM="{item}">
        <v-text-field
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.ROW_DISCOUNT_SUM"
          type='number'
          suffix='%'
          placeholder='0'
          @input="calculater(item)"
          min='0'
        ></v-text-field>
      </template>
      <template v-slot:item.NEED_COUNT="{item}">
        <v-switch
          v-model="item.NEED_COUNT"
          @change="()=>{calculater(item), update(item)}"
        ></v-switch>
      </template>
      <template v-slot:item.delete="{item}">
        <v-btn icon @click="delRow(item.ID_ROW)">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
      
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pt-3">
          <v-row>
            <v-col cols='3'>
              <v-textarea 
                dense 
                outlined
                v-model="item.DESCRIPTION_AREA"
              ></v-textarea>
            </v-col>
            <v-col cols='4'>
              <v-file-input
                dense
                outlined
                hide-input
                multiple
                prepend-icon=""
                v-model="item.newFiles"
                ref="fileinput"
              ></v-file-input>
              <v-btn color='#3bc8f5' dark @click="addFile">Добавить избражение</v-btn>
              <p class='pa-0 ma-0' v-for="(item, index) in item.OLD_IMGS" :key="index">
                <a :href="'https://crm.ms-sibir.com/'+item.link" target="_blank">{{item.name}}</a>
              </p>
              <p class='pa-0 ma-0' v-for="(item, index) in item.PROD_IMGS" :key="index">
                <a :href="'https://crm.ms-sibir.com/'+item.link" target="_blank">{{item.name}}</a>
              </p>
              <div class='pa-0 ma-0' v-for="(item, index) in item.newFiles" :key="index">
                {{item.name}}
                <v-btn icon small>
                  <v-icon>mdi-delete-forever-outline</v-icon>
                </v-btn>
              </div>
              <br>
            </v-col>
          </v-row>
        </td>
      </template>
    
    </v-data-table>
  </div>
</template>

<script>
  import debounce from 'debounce';
  export default {
    name: 'appTable',
    directives:{
      focus:{
        inserted: function(el){
          el.focus()
        }
      }
    },
    data(){
      return{
        expanded:[],
        products: [],
        prodFromServ:[],
        showAdder: false
      } 
    },
    methods:{
      expandItem(item){
        if(this.expanded[0]) this.expanded[0].expand = false;
        this.expanded = [];
        if(item.expand) this.expanded.push(item);
      },
      addFile(){
        this.$refs.fileinput.$refs.input.click()
      },
      delRow(id){
        this.$store.dispatch('DELETE_ROW', id);
      },
      calculater(item){
        let rawSum = +item.ROW_QUANTITY * (+item.PURCH_PRICE + +item.OVERPRICE + +item.LOGISTIC + +item.AUCTION);
        item.ROW_PRICE = (rawSum - (rawSum / 100 * item.ROW_DISCOUNT_SUM)).toFixed(2);

        this.$store.dispatch('UPDATE_ROW', item);
      },
      createNewProduct(item){
        this.$refs['nameinput_'+item.ID_ROW].blur();
        let newProd = {
          'IBLOCK_ID': 24,
          //'IBLOCK_SECTION_ID' =>
          'NAME': item.search, 
          'PREVIEW_TEXT': '',
          'DETAIL_PICTURE': '', 
          'DETAIL_TEXT': '',
          'WF_STATUS_ID': 1,
          'IN_SECTIONS': 'N',
        }
        this.$store.dispatch('CREATE_NEW_PRODUCT', newProd);
      },
      goto(productid){
        //TODO: открытие шторки товара
      },
      getProds: debounce(function (e){
        if(!e.search) {
          this.prodFromServ = [];
          return;
        }

        let options = {
          filter:{'%NAME': e.search},
          limit:10
        }

        BX24.callMethod('mws.products.list', options, res=>{
          if(res.data().rows.length > 0){
            this.products = res.data().rows;
            this.prodFromServ = res.data().rows;
            this.showAdder = false;
          } else {
            this.products = [];
            this.prodFromServ = [];
            this.showAdder = true;
          }
          for(let row of this.rows){
            this.products.push({NAME: row.ROW_PRODUCT_NAME})
          }
        })

      }, 1000),
      setCurrNames(arr){
        this.products = this.prodFromServ;

        for(let row of arr){
          if(!this.products.includes(row.ROW_PRODUCT_NAME) && row.ROW_PRODUCT_NAME != null)this.products.push(row.ROW_PRODUCT_NAME)
          if(row.search && !this.products.includes(row.search) && row.search != null) this.products.push(row.search)
        }
      },
      setName2arr(item){
        let curr = this.products.find(prod=>prod.rowid && prod.rowid == item.ID_ROW);
        if(curr) 
          curr.NAME = item.search;
        else {
          this.products.push({NAME:item.search, rowid: item.ID_ROW})
        }
      },
      update(item){
        this.$store.dispatch('UPDATE_ROW', item);
      }
    },
    computed:{
      headers:{
        set(){},
        get(){return this.$store.getters.GET_PRODUCT_ROWS_HEADERS}
      },
      rows:{
        get(){
          let rows = this.$store.getters.GET_PRODUCTS_ROWS;
          this.setCurrNames(rows);
          return rows;
        },
      }
    },
    mounted(){
    }
  }
</script>
<style scoped>
.mwstextarea{
  width: 400px;
}
.createItem{
  padding: 10px;
  cursor: pointer;
}
.createItem:hover{
  background-color: lightgray;
}
</style>