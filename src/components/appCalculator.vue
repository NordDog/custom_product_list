<template>
  <div class="pt-7">
    <v-row justify='end'>
      <v-col cols='1' class="pa-0">
        <v-switch
          label="НДС"
          v-model="isNds"
          class="mt-1"
        ></v-switch>
      </v-col>
      <v-col cols='1' class="pa-0 pr-6">
        <v-select
          dense
          outlined
          suffix='%'
          v-model="nds"
          :items="[20]"
          type='number'
          min='0'
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify='end'>
      <v-col cols='2' class="pa-0 pr-6">
        <v-text-field
          label="Назначение НДС"
          dense
          outlined
          v-model="ndsPurpose"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify='end'>
      <v-col cols='3'>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row justify='end'>
      <v-col cols='2' class="pa-0">Сумма закупочной цены:</v-col>
      <v-col cols='1' class="pa-0 pr-6" style="text-align:end;">{{strings.purchSum}} ₽</v-col>
    </v-row>
    <v-row justify='end'>
      <v-col cols='2' class="pa-0">Сумма цены продажи:</v-col>
      <v-col cols='1' class="pa-0 pr-6" style="text-align:end;">{{strings.sellSum}} ₽</v-col>
    </v-row>
    <v-row justify='end'>
      <v-col cols='2' class="pa-0">Сумма скидки:</v-col>
      <v-col cols='1' class="pa-0 pr-6" style="text-align:end;">{{strings.discSum}} ₽</v-col>
    </v-row>
    <v-row justify='end'>
      <v-col cols='2' class="pa-0">Процент рентабельности:</v-col>
      <v-col cols='1' class="pa-0 pr-6" style="text-align:end;">{{strings.rentPerc}} %</v-col>
    </v-row>
    <v-row justify='end'>
      <v-col cols='3'>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pl-6">
        <v-btn @click="save()" v-if="needSave" color='#bbed21'>Сохранить</v-btn>
      </v-col>
      <v-col style="text-align: end;" class="pr-6">
        <v-btn color='#3bc8f5' dark class="mr-3" @click="startWF()">согласовать с руководителем</v-btn>

        <v-tooltip left :disabled="!avaliable" color="error">
          <template v-slot:activator="{on}">
            <div v-on="on" class="d-inline-block">
              <v-btn color='#3bc8f5' :dark='!avaliable' :disabled='avaliable' @click="genDoc()">сформировать кп</v-btn>
            </div>
          </template>
          <span>Расчетная рентабельность меньше допустимой. Согласуйте с руководителем, прежде чем сформировать КП</span>
        </v-tooltip>
        
      </v-col>
    </v-row>
  </div>
</template>
<script>
  export default {
    name: 'appCalculator',

    data(){
      return{
        title:''
      } 
    },
    methods:{
      save(){
        this.$store.dispatch('SAVE_DATA');
      },
      genDoc(){
        this.$store.dispatch('GENERATE_DOC');
      },
      startWF(){
        let options = {};
        if(this.$root.placement.placement == 'CRM_QUOTE_DETAIL_TAB'){
          options = {id: this.$root.placement.options.ID, type: 'Q'}
        } else if(this.$root.placement.placement == 'CRM_DEAL_DETAIL_TAB'){
          options = {id: this.$root.placement.options.ID, type: 'D'}
        }else{
          console.log('error');
          return;
        }
        BX24.callMethod('mws.workFlow.start', options);
      }
    },
    computed:{
      isNds:{
        set(val){this.$store.dispatch('SET_IS_NDS', val)},
        get(){return this.$store.getters.GET_IS_NDS}
      },
      nds:{
        set(val){this.$store.dispatch('SET_NDS', val)},
        get(){return this.$store.getters.GET_NDS}
      },
      ndsPurpose:{
        set(val){this.$store.dispatch('SET_NDS_PURPOSE', val)},
        get(){return this.$store.getters.GET_NDS_PURPOSE}
      },
      strings(){
        return this.$store.getters.GET_CALCULATED_VALUES;
      },
      avaliable(){
        if(this.$store.getters.GET_APPROVED == 1) return false;
        return this.strings.rentPerc <= 20
      },
      needSave:{
        get(){return this.$store.getters.GET_NEED_SAVE},
        set(val){this.$store.dispatch('SET_NEED_SAVE', val)}
      }
    },
    watch:{
      avaliable: function(val){
        if(val) 
          this.title = '';
        else
          this.title = '' 
      }
    }
  }
</script>
<style scoped>
.calculator{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>