import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ShortRadar.html?style=./ShortRadar.scss'
import * as CONFIG from '../../../config/productId'
import { Message } from 'element-ui'
import moment from 'moment'

let map, L

@WithRender
@Component
export default class ShortRadar extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  productId: string = CONFIG.shortRadar
  isComponetAlive: boolean = true
  radarDate: Date = null
  radarHour: number = null
  radarMinute: number = null

  qpeqpfDate: Date = null
  qpeqpfHour: number = null
  qpeqpfMinute: number = null

  minutesArr: number[] = []
  bounds: any = []
  created() {
    map = window['map']
    L = window['L']
    for (let i = 0; i < 10; i++) {
      this.minutesArr.push(6 * i)
    }
    this.getProdTime()
    map.on('moveend', this.radarLayerChanged)
  }

  destroyed() {
    map.off('moveend', this.radarLayerChanged)
    this.isComponetAlive = false
    for (let item in this.radarProduct) {
      if (this.radarProduct[item].layer) map.removeLayer(this.radarProduct[item].layer)
    }
    for (let item in this.qpeqpfProduct) {
      if (this.qpeqpfProduct[item].layer) map.removeLayer(this.qpeqpfProduct[item].layer)
    }
  }

  private getRadarUrl(element, level?: number) {
    return `http://10.148.83.228:8922/dataunit/temporary/renderTemporaryData?type=swan&datetime={datetime}&element=${element}&time=0&level=${level ? level : 0}&top={top}&bottom={bottom}&left={left}&right={right}&width=2000&height=2000`
  }

  private getQpfQpeUrl(element, level?: number, time?: number) {
    return `http://10.148.83.228:8922/dataunit/temporary/renderTemporaryData?type=swan&datetime={datetime}&element=${element}&time=${time ? time : 0}&level=${level ? level : 0}&top={top}&bottom={bottom}&left={left}&right={right}&width=2000&height=2000`
  }
  getProdTime() {
    let date = Date.now() - Date.now() % (6 * 60 * 1000)
    let momentHolder = moment(date)
    momentHolder.subtract(18, 'minute')
    this.radarDate = new Date(momentHolder.format('YYYY/MM/DD 00:00:00'))
    this.radarHour = Number(momentHolder.format('HH'))
    this.radarMinute = Number(momentHolder.format('mm'))
    this.qpeqpfDate = new Date(momentHolder.format('YYYY/MM/DD 00:00:00'))
    this.qpeqpfHour = Number(momentHolder.format('HH'))
    this.qpeqpfMinute = Number(momentHolder.format('mm'))
  }

  radarProduct: any = {
    cappi3: { text: 'CAPPI3 公里', show: false, url: this.getRadarUrl('cappi', 3), layer: null },
    echoHeight: { text: '回波顶高', show: false, url: this.getRadarUrl('mtop'), layer: null },
    cappi1: { text: 'CAPPI1 公里', show: false, url: this.getRadarUrl('cappi', 1), layer: null },
    reflex: { text: '组合反射率', show: false, url: this.getRadarUrl('mcr'), layer: null },
    cappi5: { text: 'CAPPI5 公里', show: false, url: this.getRadarUrl('cappi', 5), layer: null },
    vil: { text: 'VI:液态降水', show: false, url: this.getRadarUrl('mvil'), layer: null },
    titan: { text: '雷暴跟踪（TITAN）', show: false, url: '', layer: null },
    hail: { text: '冰雹', show: false, url: '', layer: null },
  }
  qpeqpfProduct: any = {
    qpe: { text: 'QPE', show: false, url: this.getQpfQpeUrl('qpe'), layer: null },
    // qpeAdd: { text: 'QPE逐小时累计', show: false, url: this.getQ, layer: null },
    // qpeSix: { text: 'QPE逐6分钟', show: false, url: '', layer: null },
    // qpeSixAdd: { text: 'QPE逐6分钟累计', show: false, url: '', layer: null },
    qpf: { text: 'QPF半小时', show: false, url: this.getQpfQpeUrl('qpf', 3, 30), layer: null },
    qpfAdd: { text: 'QPF一小时', show: false, url: this.getQpfQpeUrl('qpf', 3, 60), layer: null },
    qpfSix: { text: 'QPF三小时', show: false, url: this.getQpfQpeUrl('qpf', 3, 180), layer: null },
    // qpfSixAdd: { text: 'QPF逐6分钟累计', show: false, url: '', layer: null },
    // mixRain:{ text:'融合降水逐小时', show: false, url: '', layer: null },
    // mixRainAdd:{ text:'融合降水逐小时累计', show: false, url: '', layer: null },
  }
  toggleRadarProduct(key) {
    this.radarProduct[key].show = !this.radarProduct[key].show
    if (this.radarProduct[key].show) {
      let imageUrl = this.getRadarImageUrl(key)
      this.addRadarImageLayer(key, imageUrl)
    } else {
      this.removeRadarImageLayer(key)
    }
  }

  toggleQpeqpfProduct(key) {
    this.qpeqpfProduct[key].show = !this.qpeqpfProduct[key].show
    if (this.qpeqpfProduct[key].show) {
      let imageUrl = this.getQpeqpfImageUrl(key)
      this.addQpeqpfImageLayer(key, imageUrl)
    } else {
      this.removeQpeqpfImageLayer(key)
    }
  }

  // 获取雷达产品链接
  getRadarImageUrl(key) {
    let bounds = map.getBounds(),
      left = bounds._southWest.lng,
      right = bounds._northEast.lng,
      top = bounds._northEast.lat,
      bottom = bounds._southWest.lat
    this.bounds = [[top, left], [bottom, right]]
    let datetime = moment(this.radarDate).add(this.radarHour, 'hours').add(this.radarMinute, 'minutes').format('YYYY-MM-DD HH:mm:00')
    let url = this.radarProduct[key].url.replace('{datetime}', datetime).replace('{left}', left).replace('{right}', right).replace('{top}', top).replace('{bottom}', bottom)
    return url
  }

  addRadarImageLayer(key, url) {
    let img = new Image()
    img.onload = () => {
      if (this.isComponetAlive) {
        // this.removeRadarImageLayer(key)
        // this.radarProduct[key].layer = L.imageOverlay(url, this.bounds)
        // this.radarProduct[key].layer.addTo(map)
        if (!this.radarProduct[key].layer) {
          this.radarProduct[key].layer = L.imageOverlay(url, this.bounds)
          this.radarProduct[key].layer.addTo(map)
        } else {
          this.radarProduct[key].layer.setUrl(url)
          this.radarProduct[key].layer.setBounds(L.latLngBounds(L.latLng(this.bounds[0][0], this.bounds[0][1]), L.latLng(this.bounds[1][0], this.bounds[1][1])))
        }
      } else {
        if (this.radarProduct[key].layer) map.removeLayer(this.radarProduct[key].layer)
      }

    }
    img.onerror = () => {
      if (this.isComponetAlive)
        Vue.prototype['$message']({
          type: 'warning',
          message: '该时暂无数据'
        })
      this.removeRadarImageLayer(key)
    }
    img.src = url
  }

  removeRadarImageLayer(key) {
    if (!this.radarProduct[key].layer) return
    map.removeLayer(this.radarProduct[key].layer)
    this.radarProduct[key].layer = null
  }

  // 获取QPEQPF产品链接
  getQpeqpfImageUrl(key) {
    let bounds = map.getBounds(),
      left = bounds._southWest.lng,
      right = bounds._northEast.lng,
      top = bounds._northEast.lat,
      bottom = bounds._southWest.lat
    this.bounds = [[top, left], [bottom, right]]
    let datetime = moment(this.qpeqpfDate).add(this.qpeqpfHour, 'hours').add(this.qpeqpfMinute, 'minutes').format('YYYY-MM-DD HH:mm:00')
    let url = this.qpeqpfProduct[key].url.replace('{datetime}', datetime).replace('{left}', left).replace('{right}', right).replace('{top}', top).replace('{bottom}', bottom)
    return url
  }
  addQpeqpfImageLayer(key, url) {
    let img = new Image()
    img.onload = () => {
      if (this.isComponetAlive) {
        if (!this.qpeqpfProduct[key].layer) {
          this.qpeqpfProduct[key].layer = L.imageOverlay(url, this.bounds)
          this.qpeqpfProduct[key].layer.addTo(map)
        } else {
          this.qpeqpfProduct[key].layer.setUrl(url)
          this.qpeqpfProduct[key].layer.setBounds(L.latLngBounds(L.latLng(this.bounds[0][0], this.bounds[0][1]), L.latLng(this.bounds[1][0], this.bounds[1][1])))
        }
      } else {
        if (this.qpeqpfProduct[key].layer) map.removeLayer(this.qpeqpfProduct[key].layer)
      }
    }
    img.onerror = () => {
      if (this.isComponetAlive)
        Vue.prototype['$message']({
          type: 'warning',
          message: '该时暂无数据'
        })
    }
    img.src = url
  }
  removeQpeqpfImageLayer(key) {
    if (!this.qpeqpfProduct[key].layer) return
    map.removeLayer(this.qpeqpfProduct[key].layer)
    this.qpeqpfProduct[key].layer = null
  }

  @Watch('radarDate')
  onradarDateChanged(val: any, oldVal: any) {
    this.radarLayerChanged()
    // this.qpeqpfLayerChanged()
  }
  @Watch('radarHour')
  onradarHourChanged(val: any, oldVal: any) {
    this.radarLayerChanged()
    // this.qpeqpfLayerChanged()
  }
  @Watch('radarMinute')
  onradarMinuteChanged(val: any, oldVal: any) {
    this.radarLayerChanged()
    // this.qpeqpfLayerChanged()
  }
  radarLayerChanged() {
    for (let item in this.radarProduct) {
      if (this.radarProduct[item].show) {
        let url = this.getRadarImageUrl(item)
        this.addRadarImageLayer(item, url)
      }
    }
  }
  qpeqpfLayerChanged() {
    for (let item in this.qpeqpfProduct) {
      if (this.radarProduct[item].show) {
        let url = this.getQpeqpfImageUrl(item)
        this.addQpeqpfImageLayer(item, url)
      }
    }
  }

}