import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './HeaderTitle.html?style=./HeaderTitle.scss'
import ManagecenterPopup from './managecenter-popup/ManagecenterPopup'
import AccountManagement from './account-management/AccountManagement'
import DownloadImg from './download-img/DownloadImg'
import { geoClient, mapboundaryClient } from '../../util/clientHelper'

let boundaryLine = []

@WithRender
@Component
export default class HeaderTitle extends Vue {
  @Getter('systemStore/userInfo_global') userInfo_global
  @Action('systemStore/changeUserInfo_global') changeUserInfo_global
  @Prop() viewLoginPage  

  managementView: any = null
  accountManagementView: any = null
  downLoadView: any = null
  cityList:any = []
  citySelected: string = ''
  cityListPop: boolean = false
  citiesBoundry: any = {}
  loginOutPop: boolean = false
  mounted(){
    this.geoClient()
    this.getCitiesBoundary()
  }
  async geoClient(){       //获取地址信息
    let data = await geoClient.getCities()
    if(!data){
      Vue.prototype['$message']({
        type: 'warning',
        message: '获取地址失败'
      })
      return
    }
    data.unshift({city: '广东'})
    this.cityList = data
    this.citySelected = data[0].city
  }
  toggleManagement() {   //打开管理中心窗口
    this.managementView = this.managementView ? null : ManagecenterPopup
  }
  toggleAccountManagement() {           //打开省局账号窗口
    this.accountManagementView = this.accountManagementView ? null : AccountManagement
  }
  toggleDownloaImg() {  //打开批量下载业务图窗口
    this.downLoadView = this.downLoadView ? null : DownloadImg
  }
  toggleCity(key) {         //点击城市
    this.cityListPop = false
    if(key === this.citySelected) return
    this.citySelected = key
    
    this.getCitiesBoundary()
  }
  toggleCityList() {   //点击获取城市列表
    this.cityListPop = !this.cityListPop
    if(this.loginOutPop) this.loginOutPop = false
  }
  loginOut() {  //退出登录
    this.loginOutPop = !this.loginOutPop
    if(this.cityListPop) this.cityListPop = false
  }
  loginOutBtn() {  //退出登录按钮
    this.changeUserInfo_global(null)
    this.viewLoginPage()
    this.loginOutPop = false
  }
  async getCitiesBoundary() {
    if (boundaryLine) {
      for (let line of boundaryLine) {
        window['map'].removeLayer(line)
      }
      boundaryLine = []
    }
    let data = await mapboundaryClient.getCitiesBoundary() 
    for (let el of data) {
      this.citiesBoundry[el.city.slice(0, 2)] = el
    }
    let boundary = JSON.parse(this.citiesBoundry[this.citySelected.replace('市', '')].boundary)
    let boundaryArr = []
    for (let el of boundary) {
      let arr = []
      for (let item of el) {
        arr.push([item.lat, item.lng])
      }
      boundaryArr.push(arr)
    }
    for (let el of boundaryArr) {
      let line = window['L'].polyline(el, { color: 'red', weight: 2 })
      line.addTo(window['map'])
      window['map'].fitBounds(line.getBounds())
      boundaryLine.push(line)
    }
  }

}