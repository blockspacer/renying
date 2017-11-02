import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ActualproductPopup.html?style=./ActualproductPopup.scss'

import SelectToggle from '../../commons/select-toggle/SelectToggle'

import { productsClient } from '../../../util/clientHelper'
import * as CONFIG from '../../../config/productId'
import { getVelLevel } from '../../../util/windHelper'
import { Message } from 'element-ui'
import * as moment from 'moment'

let L, map
let realInfo: any = {         // 存储站点数据
  gdAuto: null,
  gdArea: null,
  gpsSteam: null,
}
const stationIcon = window['L'].icon({
  className: 'airdromePonit',
  iconUrl: './static/img/station.png',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
})
const clusterOpt = {
  animate: false,
  disableClusteringAtZoom: 10,
  maxClusterRadius: 120,
  chunkedLoading: true
}

@WithRender
@Component({
  components: {
    SelectToggle
  }
})
export default class ActualproductPopup extends Vue {
  @Action('systemStore/closeProductView_global') closeProductView_global
  @Action('systemStore/toggleProductView_global') toggleProductView_global

  productId: string = CONFIG.actualproduct
  stationType: any = {
    gdAuto: { show: false, param: 'A' },    // param对应 链接中的字段
    gdArea: { show: false, param: 'B' },
    gpsSteam: { show: false, param: 'g' }
  }
  realType: any = {
    temp: { show: false, cname: '温度', unit: '℃', classname: 'temp' },
    ps: { show: false, cname: '气压', unit: 'pa', classname: 'ps' },
    hourrf: { show: false, cname: '降水', unit: 'mm', classname: 'hourrf' },
    dp: { show: false, cname: '露点温度', unit: '℃', classname: 'dp' },
    wind: { show: false, cname: '风力风向', unit: 'm/s', classname: 'wind' },
    rh: { show: false, cname: '相对湿度', unit: '%', classname: 'rh' },
    mean31_pwv: { show: false, cname: 'GPS水汽', unit: '', classname: 'water' },
  }
  date: Date = null
  hour: number = null
  minute: number = null
  minutesArr: number[] = []
  hourData = (() => {
    let arr = []
    for (let i = 0; i <= 23; i++) {
      arr.push(i >= 10 ? i : '0' + i)
    }
    return arr
  })()
  minify: boolean = false

  created() {
    map = window['map']
    L = window['L']
    for (let i = 0; i < 12; i++) {
      this.minutesArr.push(5 * i)
    }
    this.getProdTime()
  }

  destroyed() {
    for (let i in this.stationType) {
      if (this.stationType[i].show) this.removeLayer(i)
    }
  }

  // 获取数据时间
  async getProdTime() {
    let res = await productsClient.getProdTime()
    if (!res) return
    let date = res[0].datetime
    this.date = new Date(date)
    this.hour = Number(moment(date).format('HH'))
    this.minute = Number(moment(date).format('mm'))
  }

  getTimeString() {
    let time = moment(this.date).format('YYYY/MM/DD') + ' ' + (this.hour < 10 ? '0' + this.hour : String(this.hour)) + ':' + (this.minute < 10 ? '0' + this.minute : String(this.minute)) + ':00'
    time = moment(time).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:00')
    return time
  }

  @Watch('date')
  onDateChanged(val, oldVal) {
    this.onTimeChanged()
  }
  @Watch('hour')
  onHourChanged(val, oldVal) {
    this.onTimeChanged()
  }
  @Watch('minute')
  onMinuteChanged(val, oldVal) {
    this.onTimeChanged()
  }
  onTimeChanged() {
    for (let i in this.stationType) {
      if (this.stationType[i].show) {
        this.getProduct(i)
      }
    }
  }

  // 切换站点
  async toggleStation(key) {
    this.stationType[key].show = !this.stationType[key].show

    // 没有选中站点时 清空实况元素选中状态
    if (!this.stationType.gdAuto.show && !this.stationType.gdArea.show && !this.stationType.gpsSteam.show) {
      for (let i in this.realType) {
        this.realType[i].show = false
      }
    }

    if (this.stationType[key].show) {
      // 获取站点信息
      if (!realInfo[key]) {
        let data = await productsClient.getStation(this.stationType[key].param)
        if (!data) {
          Message({
            type: 'warning',
            message: '站点数据获取失败'
          })
          return
        }
        let obj = {}
        for (let item of data) {
          obj[item.id] = item
        }
        realInfo[key] = obj
      }
      // this.addStation(key, realInfo[key])
      this.getProduct(key)
    } else {
      this.removeLayer(key)
    }
  }

  async getProduct(key) {
    // 清除实况数据
    for (let i in realInfo[key]) {
      realInfo[key][i].datetime = null
      realInfo[key][i].elems = null
    }
    // 获取站点气象数据信息
    let msg = await productsClient.getProducts(this.stationType[key].param, this.getTimeString())
    if (!msg) {
      Message({
        type: 'warning',
        message: '实况数据获取失败'
      })
      return
    }
    if (!msg.length) {
      Message({
        type: 'warning',
        message: '实况数据获取失败'
      })
    }
    for (let opt of msg) {
      let id = opt.id
      if (realInfo[key][id]) {
        realInfo[key][id].datetime = opt.datetime
        realInfo[key][id].elems = opt.elems
      }
    }

    // 添加已选中实况元素数据
    for (let i in this.realType) {
      if (this.realType[i].show) {
        if (i === 'wind')
          this.addWind(key, realInfo[key])
        else
          this.addReal(key, i, realInfo[key])
      }
    }
  }

  // 切换数据显示
  toggleReal(key) {
    this.realType[key].show = !this.realType[key].show
    if (this.realType[key].show) {
      for (let type in realInfo) {
        if (!this.stationType[type].show) continue
        if (key === 'wind')
          this.addWind(type, realInfo[type])
        else
          this.addReal(type, key, realInfo[type])
      }
    } else {
      this.removeLayer(key)
    }
  }

  // 添加站点图标
  addStation(key, data) {
    if (key === 'gdArea') {
      let markers = new L.layerGroup()
      for (let i in data) {
        let item = data[i]
        let marker = L.marker([item.loc.lat, item.loc.lon], { icon: stationIcon })
        markers.addLayer(marker)
      }
      markers.id = key
      map.addLayer(markers)
    } else {
      for (let i in data) {
        let item = data[i]
        let marker = L.marker([item.loc.lat, item.loc.lon], { icon: stationIcon })
        marker.id = key
        marker.addTo(map)
      }
    }
  }

  // 添加站点实况数据
  addReal(type, key, data) {
    this.removeLayer(type + '_' + key)
    let markers = new L.layerGroup()
    for (let i in data) {
      let opt = data[i]
      if (!opt.elems || opt.elems[key] === undefined || opt.elems[key] > 8888 ||
        opt.elems[key] < -8888) continue
      const opts = L.divIcon({
        className: `divIcon-${key}`,
        html: `<span class="${this.realType[key].classname}">${Math.floor(opt.elems[key] * 100) / 100} ${this.realType[key].unit}</span>`
      })
      let marker = L.marker([opt.loc.lat, opt.loc.lon], { icon: opts })
      if (type === 'gdArea') {
        markers.addLayer(marker)
      } else {
        marker.id = type + '_' + key
        marker.addTo(map)
      }
    }
    if (type === 'gdArea') {
      markers.id = type + '_' + key         // 站点类型_元素类型
      map.addLayer(markers)
    }
  }

  // 添加站点风力风向数据
  addWind(type, data) {
    this.removeLayer(type + '_wind')
    let markers = new L.layerGroup(), angleMarkers = new L.layerGroup()
    for (let i in data) {
      let opt = data[i]
      if (!opt.elems) continue
      let angleMarker = L.angleMarker([opt.loc.lat, opt.loc.lon], {
        icon: new L.Icon({
          iconUrl: `static/wind/${getVelLevel(opt.elems.wd2df)}.png`,
          iconSize: [18, 32],
          iconAnchor: [0, 32]
        }),
        iconAngle: opt.elems.wd2dd,
        iconOrigin: '0% 100%',
        zIndexOffset: -1
      })


      let opts = L.divIcon({
        className: 'divIcon-wind',
        html: `<span class='wind'>${Math.floor(opt.elems.wd2df * 100) / 100} ${this.realType.wind.unit}</span>`
      })
      let marker = L.marker([opt.loc.lat, opt.loc.lon], { icon: opts })           // 风速

      if (type === 'gdArea') {
        angleMarkers.addLayer(angleMarker)
        markers.addLayer(marker)
      } else {
        angleMarker.id = type + '_wind'
        angleMarker.addTo(map)
        // marker.id = type + '_wind'
        // marker.addTo(map)
      }
    }
    if (type === 'gdArea') {
      angleMarkers.id = type + '_wind'
      map.addLayer(angleMarkers)
      // markers.id = type + '_wind'
      // map.addLayer(markers)
    }
  }

  hourChange(val) {
    this.hour = val
  }
  minuteChange(val) {
    this.minute = val
  }

  // 删除图层数据
  removeLayer(key) {
    let reg = new RegExp(key)
    map.eachLayer(e => {
      if (reg.test(e.id)) map.removeLayer(e)
    })
  }
}