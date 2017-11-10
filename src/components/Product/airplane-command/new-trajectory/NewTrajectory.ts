import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './NewTrajectory.html?style=./NewTrajectory.scss'
import { Message } from 'element-ui'

import axios from 'axios'
import jsonp from 'axios-jsonp'
import * as moment from 'moment'

let airportData = null
@WithRender
@Component
export default class NewTrajectory extends Vue {
  name: string = ''
  polylineHolder: any = null
  areaSelected: number[] = []
  minDbz = 10
  maxDbz = 30
  airport = ''
  airportData = airportData ? airportData : null
  markerHolder: any[] = []
  convertedData: Number[][] = []
  lineReqUrl = 'http://10.148.16.217:9020/radar/AirLineDesign'
  changeReUrl = 'http://10.148.16.217:9020/dao/airline_design/update'
  addReqUrl = 'http://10.148.16.217:9020/dao/airline_design/add'
  loading: boolean = false
  @Prop() historyData
  @Prop() clearHistoryData

  created() {
    if (!this.airportData)
      this.getAirportData()

    if (this.historyData) {
      this.convertData(this.historyData)
      this.drawAirLien()
      this.clearHistoryData()
    }
  }

  async design(date) {
    if (this.areaSelected.length === 0) {
      Message({
        type: 'warning',
        message: '请选择作业区域'
      })
      return
    }
    this.loading = true
    let mtHolder = typeof date === 'number' ? moment(date) : moment()
    mtHolder.subtract(18, 'minute')
    let nowMinute = Number(mtHolder.format('mm'))
    if (nowMinute % 6 <= 3) {
      mtHolder.set('minute', Math.floor(nowMinute / 6) * 6)
    } else {
      mtHolder.set('minute', Math.floor(nowMinute / 6) * 6)
    }
    let params: any = {
      layer: 5,
      MaxValue: this.maxDbz,
      MinValue: this.minDbz,
      airportName: this.airport,
      date: mtHolder.format('YYYY-MM-DD HH:mm:00'),
      AreaIds: ''
    }
    for (let item of this.areaSelected) {
      if (params.AreaIds)
        params.AreaIds += ';' + String(item)
      else
        params.AreaIds += String(item)
    }
    let res = await axios({
      url: this.lineReqUrl,
      adapter: jsonp,
      params
    })
    this.removeAllLayer()

    Message({
      type: 'success',
      message: '左键按住拖动航点，双击删除'
    })
    this.loading = false

    this.convertData(res.data)
    this.drawAirLien()
  }

  drawAirLien() {
    let L = window['L'],
      map = window['map'],
      icon = L.icon({
        iconUrl: '/static/img/plane_point.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

    for (let item of this.convertedData) {
      let marker = L.marker(item, {
        draggable: true,
        icon
      }).addTo(window['map'])
      marker.on('drag', (e) => {
        for (let i in this.markerHolder) {
          if (e.target === this.markerHolder[i]) {
            this.convertedData[i] = [e.latlng.lat, e.latlng.lng]
            this.polylineHolder.setLatLngs(this.convertedData)
          }
        }
      })
      marker.on('dblclick', e => {
        for (let i in this.markerHolder) {
          if (e.target === this.markerHolder[i]) {
            this.convertedData.splice(Number(i), 1)
            map.removeLayer(this.markerHolder[i])
            this.markerHolder.splice(Number(i), 1)
            this.polylineHolder.setLatLngs(this.convertedData)
          }
        }
      })
      this.markerHolder.push(marker)
    }
    this.polylineHolder = L.polyline(this.convertedData, { color: 'violet' }).addTo(map)
    map.fitBounds(this.polylineHolder.getBounds())
  }

  convertData(data) {
    this.convertedData = []
    if (!Array.isArray(data[0]))
      for (let item of data) {
        this.convertedData.push([item.y, item.x])
      }
    else
      for (let item of data) {
        this.convertedData.push([item[1], item[0]])
      }
  }

  destroyed() {
    this.removeAllLayer()
  }

  private removeAllLayer() {
    let map = window['map']
    if (this.markerHolder.length) {
      for (let item of this.markerHolder) {
        map.removeLayer(item)
      }
      this.markerHolder = []
    }
    if (map.hasLayer(this.polylineHolder)) {
      map.removeLayer(this.polylineHolder)
    }
  }

  async getAirportData() {
    let res = await axios({
      adapter: jsonp,
      url: 'http://10.148.16.217:11160/renyin5/conn/airports'
    })
    this.airportData = res.data
    this.airport = this.airportData[0].chinesename
  }

  async savePlane() {
    if (this.name.length === 0) {
      Message({
        type: 'warning',
        message: '请输入航迹名称'
      })
      return
    }
    let convertedData = []
    for(let item of this.convertedData) {
      console.info(item)
      convertedData.push([item[1], item[0]])
    }
    let data = {
      data: convertedData,
      datetime: moment().format('YYYY-MM-DD HH:mm:00'),
      name: this.name
    }
    console.info(data)
    let res = await axios({
      url: this.addReqUrl,
      adapter: jsonp,
      params: {
        data: JSON.stringify(data)
      }
    })
    Message({
      type: 'success',
      message: '成功保存'
    })
    this.removeAllLayer()
    this.convertedData = []
    this.name = ''
    this.polylineHolder = []
  }

  toggleAreaSelected(key) {
    let index = this.areaSelected.indexOf(key)
    if (index === -1) this.areaSelected.push(key)
    else this.areaSelected.splice(index, 1)
  }
}

