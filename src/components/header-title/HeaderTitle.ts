import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './HeaderTitle.html?style=./HeaderTitle.scss'
import ManagecenterPopup from './managecenter-popup/ManagecenterPopup'
import { geoClient, mapboundaryClient } from '../../util/clientHelper'

let boundaryLine = []

@WithRender
@Component
export default class HeaderTitle extends Vue {
  @Getter('systemStore/userInfo_global') userInfo_global
  managementView: any = null
  cityList:any = []
  citySelected: string = ''
  cityListPop: boolean = false
  citiesBoundry: any = {}
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
  toggleManagement() {
    this.managementView = this.managementView ? null : ManagecenterPopup
  }
  toggleCity(key) {         //点击城市
    this.cityListPop = false
    if(key === this.citySelected) return
    this.citySelected = key
    
    this.getCitiesBoundary()
  }
  toggleCityList() {   //点击获取城市列表
    this.cityListPop = !this.cityListPop
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
    let boundary = JSON.parse(this.citiesBoundry[this.citySelected].boundary)
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
      boundaryLine.push(line)
    }
  }

}