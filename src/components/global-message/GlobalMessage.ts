import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './GlobalMessage.html?style=./GlobalMessage.scss'

import axios from 'axios'
import jsonp from 'axios-jsonp'

let transportLayerHolder = {},
  map = window['map'],
  L = window['L'],
  vehicleIcon = L.icon({
    iconUrl: '/static/img/home_transport.png',
    iconSize: [102 / 4, 89 / 4],
    iconAnchor: [102 / 8, 89 / 8]
  })

@WithRender
@Component
export default class GlobalMessage extends Vue {
  @Getter('systemStore/socketMessage_global') socketMessage_global: any[]
  @Getter('systemStore/socketCurrentMessage_global') socketCurrentMessage_global
  @Getter('systemStore/isSearchOperateStationWindowOn_global')
  isSearchOperateStationWindowOn
  @Getter('systemStore/transportData_global') transportData_global
  @Getter('systemStore/isTransportDataChange_global') isTransportDataChange_global
  @Getter('systemStore/isShowTransportLayer_global') isShowTransportLayer_global

  isShowHistoryMessage: boolean = false
  intervalHolder: any = null
  get socketMessage() {
    let message = this.socketMessage_global.slice(this.socketCurrentMessage_global.length - 2,
      this.socketMessage_global.length - 1)
    message.reverse()
    return message
  }

  created() {
    this.intervalHolder = setInterval(() => {
      for (let key in transportLayerHolder) {
        if (Date.now() - transportLayerHolder[key].updateTime > 2 * 60 * 1000) {
          for (let i in transportLayerHolder[key]) {
            if (i === 'updateTime') continue
            window['map'].removeLayer(transportLayerHolder[key][i])
          }
          delete transportLayerHolder[key]
        }
      }
    }, 10000)
  }

  @Watch('isTransportDataChange_global')
  isTransportDataChange_globalChanged(val: any, oldVal: any): void {
    console.info('changed!')
    this.updateTransportLayer()
  }
  @Watch('isShowTransportLayer_global')
  isShowTransportLayer_globalChange(val) {
    for (let i in transportLayerHolder) {
      if (!window['map'].hasLayer(transportLayerHolder[i]) && val) {
          window['map'].addLayer(transportLayerHolder[i])
      }
      if (window['map'].hasLayer(transportLayerHolder[i]) && !val) {
          window['map'].removeLayer(transportLayerHolder[i])
      }
    }
  }

  updateTransportLayer() {
    for (let transportId in this.transportData_global) {
      let data: AmmunitionEvent = this.transportData_global[transportId]
      if (!transportLayerHolder[transportId]) {
        transportLayerHolder[transportId] = {
          lineLayer: null,
          vehicleLayer: null
        }
        if (data.pos.length !== 0) {
          addLineAndVehicleLayer(data, transportId, this.isShowTransportLayer_global)
        }
      } else {
        let LastPos = data.pos[data.pos.length - 1]
        if (transportLayerHolder[transportId].vehicleLayer) {
          transportLayerHolder[transportId].vehicleLayer.setLatLng(
            [LastPos.lat, LastPos.lon]
          )
          transportLayerHolder[transportId].lineLayer.setLatLngs(getLineData(data))
          transportLayerHolder[transportId].toEnd.setLatLngs([
            [LastPos.lat, LastPos.lon],
            data.endPos
          ])
        } else {
          addLineAndVehicleLayer(data, transportId, this.isShowTransportLayer_global)
        }
      }
    }

    function addLineAndVehicleLayer(data, transportId, addToMap: boolean) {
      let LastPos = data.pos[data.pos.length - 1]
      transportLayerHolder[transportId] = L.layerGroup()
      transportLayerHolder[transportId].add(L.marker(
        [LastPos.lat, LastPos.lon], { icon: vehicleIcon }
      ))
      transportLayerHolder[transportId].add(L.polyline(
        getLineData(data), { color: 'violet' }
      ))
      transportLayerHolder[transportId].add(L.circle(
        data.endPos, { radius: 50 }
      ));
      transportLayerHolder[transportId].add(L.marker(data.endPos, {
        icon: new L.DivIcon({
          className: 'transport-icon',
          html: `<span>${data.endName}</span>`
        })
      }))
      transportLayerHolder[transportId].add(L.polyline(
        [
          [LastPos.lat, LastPos.lon],
          data.endPos
        ], { color: 'darkorange', dashArray: [4, 8] }
      ))
      transportLayerHolder[transportId].add(L.circle(
        [data.pos[0].lat, data.pos[0].lon], { radius: 50 }
      ));
      transportLayerHolder[transportId].add(L.marker(
        [data.pos[0].lat, data.pos[0].lon], {
          icon: new L.DivIcon({
            className: 'transport-icon',
            html: `<span>${data.startName}</span>`
          })
        }))
      transportLayerHolder[transportId].updateTime = Date.now()
      if (addToMap)
        window['map'].addLayer(transportLayerHolder[transportId])
    }

    function getLineData(data) {
      let lineData = []
      for (let item of data.pos) {
        lineData.push([item.lat, item.lon])
      }
      return lineData
    }
  }

}



