import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mainTableHeaders: [],
    rows: [],
    dealFields: [],
    showProductList: false,
    productsTree :[],
    productsHeaders: [],
    calculatedValues:{
      purchSum: 0,
      sellSum: 0,
      discSum: 0,
      rentPerc: 0
    },
    needSave:false
  },
  mutations: {
    SET_MAIN_TABLE_HEADERS(state, value){
      state.mainTableHeaders = value;
    },
    SET_PRODUCTS_ROWS(state, value){
      state.rows = value;
    },
    SET_DEAL_DATA(state, value){
      state.dealFields = value;
    },
    SET_PRODUCTS_TREE(state, value){
      state.productsTree = value;
    },
    SET_SHOW_PRODUCT_LIST(state, value){
      state.showProductList = value;
    },
    SET_PRODUCTS_HEADERS(state, value){
      state.productsHeaders = value;
    },
    ADD_PRODUCT_ROW(state, value){
      let ids = [];
      for (let row of state.rows){
        ids.push(Number(row.ID_ROW))
      }
      
      value.ID_ROW = ids[ids.length -1] + 1;

      if(!state.rows[state.rows.length -1].ROW_PRODUCT_NAME){
        state.rows[state.rows.length -1].ROW_PRODUCT_NAME = value.ROW_PRODUCT_NAME;
        state.rows[state.rows.length -1].ROW_PRODUCT_ID = value.ROW_PRODUCT_ID;
        if(value.newProd) state.rows[state.rows.length -1].newProd = true;
      } else {

        if(ids.includes(value.ID_ROW)){
          while(ids.includes(value.ID_ROW)){
            value.ID_ROW++;
          }
        }

        state.rows.push(value);
      }
    },
    DELETE_ROW(state, id){
      let temp = state.rows.filter(row=>row.ID_ROW != id)
      if(temp.length != 0){
        state.rows = temp;
      } else {
        state.rows = [{
          AUCTION: 0,
          DESCRIPTION_AREA: 0,
          ID_ROW: 0,
          IMAGE: [],
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
          ROW_PRODUCT_ID: 0,
          ROW_PRODUCT_NAME: '',
          ROW_QUANTITY: 0,
          ROW_SORT: 0,
          RRC: 0,
        }];
      }
    },
    SET_TOTAL_LOGISTIC(state, value){
      state.dealFields.TOTAL_LOGISTIC = value;
      this.commit('RECALC_LOG_AND_AUC')
    },
    SET_TOTAL_AUCTION(state, value){
      state.dealFields.TOTAL_AUCTION = value;
      this.commit('RECALC_LOG_AND_AUC')
    },
    SET_IS_NDS(state, value){
      state.dealFields.IS_NDS  = value;
    },
    SET_NDS(state, value){
      state.dealFields.NDS = value;
    },
    SET_NDS_PURPOSE(state, value){
      state.dealFields.NDS_PURPOSE = value;
    },
    UPDATE_ROW(state, value){
      let tempRow = state.rows.find(item=>item.ID_ROW === value.ID_ROW)
      tempRow = value;
      this.commit('RECALC_LOG_AND_AUC')
    },
    RECALC_LOG_AND_AUC(state){
      let total = 0;
      for(let row of state.rows){
        if(row.NEED_COUNT){
          total += +row.ROW_QUANTITY;
        }
      }
      for(let row of state.rows){
        if(row.NEED_COUNT){
          row.LOGISTIC = (state.dealFields.TOTAL_LOGISTIC / total * row.ROW_QUANTITY).toFixed(2);
          row.AUCTION = (state.dealFields.TOTAL_AUCTION/total*row.ROW_QUANTITY).toFixed(2);
        }
      }
      this.commit('RECOUNT_CALCULATOR')
    },
    RECOUNT_CALCULATOR(state){
      state.calculatedValues.purchSum = 0;
      state.calculatedValues.sellSum = 0;
      state.calculatedValues.discSum = 0;
      state.calculatedValues.rentPerc = 0;

      for(let row of state.rows){
        state.calculatedValues.purchSum += +row.ROW_QUANTITY * +row.PURCH_PRICE;
        state.calculatedValues.sellSum += +row.ROW_PRICE;
        state.calculatedValues.discSum += +((+row.ROW_QUANTITY * (+row.PURCH_PRICE + +row.OVERPRICE + +row.LOGISTIC + +row.AUCTION))/ 100 * +row.ROW_DISCOUNT_SUM).toFixed(2);
      }
      state.calculatedValues.rentPerc = (((state.calculatedValues.sellSum - state.calculatedValues.purchSum) / state.calculatedValues.sellSum) * 100).toFixed(2);
    },
    SET_NEED_SAVE(state, value){
      state.needSave = value;
    }
  },
  actions:{
    GET_MAIN_TABLE_HEADERS({commit}){
      BX24.callMethod('mws.productrowsheaders.get', {}, res=>{
        commit('SET_MAIN_TABLE_HEADERS', res.data());
      });
    },
    GET_PRODUCTS_ROWS_AND_DEAL_DATA({commit}){
      BX24.callMethod('mws.productrows.get', {entity_type: 'D', id: 7}, res=>{
        commit('SET_PRODUCTS_ROWS', res.data().rows);
        commit('SET_DEAL_DATA', res.data().data);
      })
    },
    GET_PRODUCTS_TREE({commit}){
      BX24.callMethod('mws.productsections.gettree', {}, res=>{
        commit('SET_PRODUCTS_TREE', res.data());
      })
    },
    GET_PRODUCTS_HEADERS({commit}){
      BX24.callMethod('mws.productfields.list', {}, res=>{
        commit('SET_PRODUCTS_HEADERS', res.data())
      })
    },
    SET_SHOW_PRODUCT_LIST({commit}, value){
      commit('SET_SHOW_PRODUCT_LIST', value);
    },
    ADD_PRODUCT_ROW({commit}, value){
      commit('ADD_PRODUCT_ROW', value)
      commit('SET_NEED_SAVE', true);
    },
    DELETE_ROW({commit}, value){
      commit('DELETE_ROW', value);
      commit('SET_NEED_SAVE', true);
    },
    SET_TOTAL_LOGISTIC({commit}, value){
      commit('SET_TOTAL_LOGISTIC', value);
      commit('SET_NEED_SAVE', true);
    },
    SET_TOTAL_AUCTION({commit}, value){
      commit('SET_TOTAL_AUCTION', value);
      commit('SET_NEED_SAVE', true);
    },
    SET_IS_NDS({commit}, value){
      commit('SET_IS_NDS', value);
      commit('SET_NEED_SAVE', true);
    },
    SET_NDS({commit}, value){
      commit('SET_NDS', value);
      commit('SET_NEED_SAVE', true);
    },
    SET_NDS_PURPOSE({commit}, value){
      commit('SET_NDS_PURPOSE', value);
      commit('SET_NEED_SAVE', true);
    },
    UPDATE_ROW({commit}, value){
      commit('UPDATE_ROW', value);
      commit('SET_NEED_SAVE', true);
    },
    CREATE_NEW_PRODUCT({commit}, value){
      BX24.callMethod('mws.product.create', value, res=>{
        if(res.data() > 0){
          commit('ADD_PRODUCT_ROW', {
            AUCTION: 0,
            DESCRIPTION_AREA: 0,
            ID_ROW: 0,
            IMAGE: [],
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
            ROW_PRODUCT_ID: res.data(),
            ROW_PRODUCT_NAME: value.NAME,
            ROW_QUANTITY: 0,
            ROW_SORT: 0,
            RRC: 0,
            newProd: true
          });
          commit('SET_NEED_SAVE', true);
        }
      })
    },
    SET_NEED_SAVE({commit}, value){
      commit('SET_NEED_SAVE', value)
    },
    SAVE_DATA({commit, state}){
      let options = {
        'id': 7,
        'rows': state.rows,
        'data': {
          'UF_IS_NDS':state.dealFields.IS_NDS,
          'UF_NDS':state.dealFields.NDS,
          'UF_NDS_PURPOSE':state.dealFields.NDS_PURPOSE,
          'UF_TOTAL_AUCTION':state.dealFields.TOTAL_AUCTION,
          'UF_TOTAL_LOGISTIC':state.dealFields.TOTAL_LOGISTIC,
        }
      }
      BX24.callMethod('mws.productrows.set', options, res=>{
        console.log(res.data())
        commit('SET_NEED_SAVE', false);
      })
    }
  },
  getters: {
    GET_PRODUCT_ROWS_HEADERS(state){
      return state.mainTableHeaders;
    },
    GET_PRODUCTS_ROWS(state){
      return state.rows;
    },
    GET_SHOW_PRODUCT_LIST(state){
      return state.showProductList;
    },
    GET_PRODUCTS_TREE(state){
      return state.productsTree;
    },
    GET_PRODUCTS_HEADERS(state){
      return state.productsHeaders;
    },
    GET_TOTAL_LOGISTIC(state){
      return state.dealFields.TOTAL_LOGISTIC
    },
    GET_TOTAL_AUCTION(state){
      return state.dealFields.TOTAL_AUCTION
    },
    GET_IS_NDS(state){
      return state.dealFields.IS_NDS;
    },
    GET_NDS(state){
      return state.dealFields.NDS;
    },
    GET_NDS_PURPOSE(state){
      return state.dealFields.NDS_PURPOSE;
    },
    GET_CALCULATED_VALUES(state){
      return state.calculatedValues;
    },
    GET_NEED_SAVE(state){
      return state.needSave;
    }
  }
})
