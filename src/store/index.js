import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import account from './modules/account-mod'
import search from './modules/search-mod'
import sms from './modules/sms-mod'
import baseData from './modules/baseData-mod'
import locations from './modules/locations-mod'
import hospitals from './modules/hospitals-mod'
import department from './modules/department-mod'
import booking from './modules/booking-mod'
import doctor from './modules/doctor-mod'
import image from './modules/image-mod'
import order from './modules/order-mod'
import transfer from './modules/transfer-mod'
import caseHis from './modules/caseHis-mod'
import user from './modules/user-mod'
import tabbar from './modules/tab-mode'
import {hdept, hhos, hdoc, hindex} from '../views/Home/modules/'
import articles from './modules/articles-mod'
import trade from './modules/trade-mod'
import chat from './modules/chat-mod'
import insurance from './modules/insurance-mod'
import notify from './modules/Notify-mod'
import favourite from './modules/favourite-mod'
import tool from './modules/tool-mod'
import comments from './modules/comments-mod'
import prenatal from './modules/prenatal-mod'
import groupchat from './modules/group-chat-mod'
import obstetrics from './modules/obstetrics-mod'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  actions,
  getters,
  modules: {
    account,
    search,
    sms,
    baseData,
    locations,
    hospitals,
    department,
    booking,
    doctor,
    image,
    hdept,
    hhos,
    hdoc,
    hindex,
    order,
    transfer,
    user,
    caseHis,
    tabbar,
    articles,
    trade,
    chat,
    insurance,
    notify,
    favourite,
    tool,
    prenatal,
    comments,
    groupchat,
    obstetrics
  },
  state: {
    imgServer: 'http://imgd.v2.yimi99.com:9888',
    // imgServer: 'http://imgd.yimi99.com',
    webSocketServer: 'ws://api.v2.yimi99.com:10088/chat/'
    // webSocketServer: 'ws://www.yimi99.com/chat/'
  }
})
export default store
