import Vue from 'vue'
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import WithRender from './App.html?style=./App.scss'

import { CookieHelper } from './util/cookie'
import { userClient } from './util/clientHelper'

import ProductEntry from './components/product-entry/ProductEntry'
import LoginPage from './components/login-page/LoginPage';
import HeaderTitle from './components/header-title/HeaderTitle';
import TopNav from './components/top-nav/TopNav';
import LeftnavAnalyze from './components/leftnav-analyze/LeftnavAnalyze';
import Zmap from './components/z-map/Zmap'
import GlobalMessage from './components/global-message/GlobalMessage'

import ToolBar from './components/tool-bar/ToolBar'
import ManagecenterPopup from "./components/managecenter-popup/ManagecenterPopup"
import DemandWarning from './components/GlobalPopup/demand-warning/DemandWarning'
import AssignmentTrack from './components/assignment-track/AssignmentTrack'
import CappiProfile from './components/GlobalPopup/cappi-profile/CappiProfile'

@WithRender
@Component({
  components: {
    HeaderTitle,
    ProductEntry,
    TopNav,
    LeftnavAnalyze,
    GlobalMessage,
    Zmap,
    ToolBar,
    DemandWarning,
    ManagecenterPopup,
    AssignmentTrack,
  }
})

export default class App extends Vue {
  @Getter('systemStore/userInfo_global') userInfo_global
  @Getter('systemStore/isCappiProfileOn_global') isCappiProfileOn_global
  @Action('systemStore/changeUserInfo_global') changeUserInfo_global

  loginPageView = null
  leftNavView: any = null
  CappiProfileView: any = null

  closeLoginPage() {
    this.loginPageView = null
  }

  async created() {
    let cookie = CookieHelper.getCookie('login')
    if (cookie.length === 0) {
      this.loginPageView = LoginPage
    } else {
      let loginData = cookie.split('%')
      let data = await userClient.login(loginData[0], loginData[1])
      this.changeUserInfo_global(data)
      this.$store.dispatch('systemStore/connectSocket_global')
    }
  }

  @Watch('isCappiProfileOn_global')
  onisCappiProfileOn_globalChanged(val: any, oldVal: any) {
    this.CappiProfileView = val ? CappiProfile : null
  }
}