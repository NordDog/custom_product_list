<template>
  <div>
    <v-data-table
      :headers='headers'
      hide-default-footer
      :items='rows'
      item-key='ID_ROW'
      :items-per-page="-1"
      single-expand
      :expanded.sync="expanded"
    >
       <template v-slot:item.PROD_ARTIKUL_U3YN9N="{item}">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="my-3"
              style="min-width:120px; max-width: 120px;"
              hide-details
              v-on="on"
              v-bind="attrs"
              dense
              outlined
              v-model="item.PROD_ARTIKUL_U3YN9N"
              readonly
              :ref="'atrticul_'+item.ID_ROW"
            />
          </template>
          
          <div style="max-width: 500px">{{item.PROD_ARTIKUL_U3YN9N}}</div>
        </v-tooltip>
      </template>

      <template v-slot:item.PROD_DPLER_NAME="{item}">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                class="my-3"
                style="max-width:80px"
                v-on="on"
                v-bind="attrs"
                hide-details
                dense
                outlined
                readonly
                v-model="item.PROD_DPLER_NAME"
                :ref="'dployer_name_'+item.ID_ROW"
            />
          </template>
          
          <div style="max-width: 500px">{{item.PROD_DPLER_NAME}}</div>
        </v-tooltip>
      </template>

      <template v-slot:item.ROW_PRODUCT_NAME="{item}">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-autocomplete
              style="min-width:350px"
              class="my-3"
              hide-details
              dense
              v-on="on"
              v-bind="attrs"
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
                <v-btn v-if="item.ROW_PRODUCT_ID > 0" style="margin-top: -7px;" icon @click="goto(item.ROW_PRODUCT_ID)"><v-icon>mdi-arrow-right</v-icon></v-btn>
              </template>
              <template v-slot:prepend-inner>
                <v-icon color='#3bc8f5' v-if="item.newProd">mdi-new-box</v-icon>
              </template>
            </v-autocomplete>
          </template>
          
          <div style="max-width: 500px">{{item.ROW_PRODUCT_NAME}}</div>
        </v-tooltip>
      </template>

      <template v-slot:item.PROD_OBEM_KIOLLV="{item}">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                class="my-3"
                style="max-width:80px"
                v-on="on"
                v-bind="attrs"
                hide-details
                dense
                outlined
                readonly
                v-model="item.PROD_OBEM_KIOLLV"
                :ref="'obem_kilov_'+item.ID_ROW"
            />
          </template>

          <div style="max-width: 500px">{{item.PROD_OBEM_KIOLLV}}</div>
        </v-tooltip>
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
          @keydown="autowidth($event)"
          @input="calculater(item)"
          min='0'
          :ref="'quantity_'+item.ID_ROW"
        ></v-text-field>
      </template>
      <template v-slot:item.PURCH_PRICE="{item}">
        <v-text-field
          style="min-width:100px"
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.PURCH_PRICE"
          type='number'
          suffix="₽"
          placeholder='0'
          @keydown="autowidth($event)"
          @input="calculater(item)"
          min='0'
          :ref="'purchPrice_'+item.ID_ROW"
        ></v-text-field>
      </template>
      <template v-slot:item.RRC="{item}">
        <v-text-field
          style="min-width:80px"
          readonly
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.RRC"
          type='number'
          suffix="₽"
          placeholder='0'
          @keydown="autowidth($event)"
          @input="calculater(item)"
          min='0'
          :ref="'rrc_'+item.ID_ROW"
        ></v-text-field>
      </template>
      <template v-slot:item.OVERPRICE="{item}">
        <v-text-field
          style="min-width:100px"
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.OVERPRICE"
          type='number'
          suffix="₽"
          placeholder='0'
          @keydown="autowidth($event)"
          @input="calculater(item, true)"
          min='0'
          :ref="'overprice'+item.ID_ROW"
        ></v-text-field>
      </template>
      <template v-slot:item.LOGISTIC="{item}">
        <v-text-field
          style="min-width:80px"
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.LOGISTIC"
          type='number'
          suffix="₽"
          placeholder='0'
          @keydown="autowidth($event)"
          @input="calculater(item)"
          min='0'
          :ref="'logistic'+item.ID_ROW"
        ></v-text-field>
      </template>
      <template v-slot:item.AUCTION="{item}">
        <v-text-field
          style="min-width:80px"
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.AUCTION"
          type='number'
          suffix="₽"
          placeholder='0'
          @keydown="autowidth($event)"
          @input="calculater(item)"
          min='0'
          :ref="'auction_'+item.ID_ROW"
        ></v-text-field>
      </template>
      <template v-slot:item.ROW_DISCOUNT_SUM="{item}">
        <v-text-field
          style="min-width:80px"
          class="my-3"
          hide-details
          dense
          outlined
          v-model="item.ROW_DISCOUNT_SUM"
          type='number'
          suffix='%'
          placeholder='0'
          @keydown="autowidth($event)"
          @input="calculater(item)"
          min='0'
          :ref="'discount_'+item.ID_ROW"
        ></v-text-field>
      </template>
      <template v-slot:item.NEED_COUNT="{item}">
        <v-switch
          v-model="item.NEED_COUNT"
          @change="calculater(item)"
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
                @input='update(item)'
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
                @change='update(item)'
              ></v-file-input>
              <v-btn color='#3bc8f5' dark @click="addFile">Добавить избражение</v-btn>
              <p class='pa-0 ma-0' v-for="(file, index) in item.OLD_IMGS" :key="file.fid">
                <a :href="'https://crm.ms-sibir.com/'+file.link" target="_blank">{{file.name}}</a>
                <v-btn icon small @click="delOldImg(item, file.fid)">
                  <v-icon>mdi-delete-forever-outline</v-icon>
                </v-btn>
              </p>
              <p class='pa-0 ma-0' v-for="(item, index) in item.PROD_IMGS" :key="index">
                <a :href="'https://crm.ms-sibir.com/'+item.link" target="_blank">{{item.name}}</a>
              </p>
              <div class='pa-0 ma-0' v-for="(file, index) in item.newFiles" :key="index">
                {{file.name}}
                <v-btn icon small @click="delImg(item, file.name)">
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
      calculater(item, isoverprice = false){

        this.numerator(item);

        let oldSum = item.ROW_PRICE;

        if(!isoverprice) item.OVERPRICE = ((+item.PURCH_PRICE + +item.LOGISTIC + +item.AUCTION)/2).toFixed(2);

        item.RRC = ((+item.PURCH_PRICE + +item.LOGISTIC + +item.AUCTION) * 1.5).toFixed(2);

        item.XPRICE = +item.PURCH_PRICE + +item.OVERPRICE + +item.LOGISTIC + +item.AUCTION;

        let rawSum = (+item.ROW_QUANTITY * (+item.PURCH_PRICE + +item.OVERPRICE + +item.LOGISTIC + +item.AUCTION)).toFixed(2);
        item.ROW_PRICE = (rawSum - (rawSum / 100 * item.ROW_DISCOUNT_SUM)).toFixed(2);

        if(+oldSum != +item.ROW_PRICE) this.$store.dispatch('UPDATE_ROW', item);

        let calcwidth = 80, $ref;

        for(let field in this.$refs){//возможно явно отседова забирать ррц и проч поля

          if(!this.$refs[field]) continue;

          if(field.includes(item.ID_ROW) && !field.includes('nameinput')){
            if(field.includes('rrc')){ //rrcfield width
              calcwidth = String(item.RRC).length ? String(item.RRC).length * 9 + 80 : 80;
            }
            else if(field.includes('overprice') && !isoverprice){//overpricefield width
              calcwidth = String(item.OVERPRICE).length ? String(item.OVERPRICE).length * 9 + 80 : 80;
            } else {
              calcwidth = this.$refs[field].value ? String(this.$refs[field].value).length * 9 + 80 : 80;
            }
            $ref = this.$refs[field];
            $ref.$el.style.width = calcwidth+'px';
          }
        }

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
        BX24.callMethod('mws.product.show', {
          entity_type: this.$root.placement.placement == 'CRM_DEAL_DETAIL_TAB' ? 'D' : 'Q', 
          entity_id: this.$root.placement.options.ID, 
          prodId: productid
          }
        );
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
      },
      delImg(item, fname){
        item.newFiles = item.newFiles.filter(item=>item.name != fname);
        this.$store.dispatch('UPDATE_ROW', item);
      },
      delOldImg(item, fId){
        item.OLD_IMGS = item.OLD_IMGS.filter(item=>item.fid != fId);
        item.IMAGE = item.IMAGE.filter(item=>item != fId);
        this.$store.dispatch('UPDATE_ROW', item);
      },
      //повесить на все поля, запускать в цикле при открытии страницы
      autowidth(ev){
        let calcWidth = ev.target.value.length > 0 ? ev.target.value.length * 9 + 80 : 80;
        ev.target.parentNode.parentNode.parentNode.parentNode.style.width = calcWidth+'px';
      },
      numerator(item){
        item.AUCTION = Number(item.AUCTION);
        item.LOGISTIC = Number(item.LOGISTIC);
        item.OVERPRICE = Number(item.OVERPRICE);
        item.PURCH_PRICE = Number(item.PURCH_PRICE);
        item.ROW_DISCOUNT_SUM = Number(item.ROW_DISCOUNT_SUM);
        item.ROW_PRICE = Number(item.ROW_PRICE);
        item.ROW_PRICE_ACCOUNT = Number(item.ROW_PRICE_ACCOUNT);
        item.ROW_PRICE_BRUTTO = Number(item.ROW_PRICE_BRUTTO);
        item.ROW_PRICE_EXCLUSIVE = Number(item.ROW_PRICE_EXCLUSIVE);
        item.ROW_PRICE_NETTO = Number(item.ROW_PRICE_NETTO);
        item.ROW_QUANTITY = Number(item.ROW_QUANTITY);
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
          for(let row of rows){
            this.calculater(row, true);
          }
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