import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MountainFlood.html?style=./MountainFlood.scss'
import * as CONFIG from '../../../config/productId'
import * as moment from 'moment'
import axios from 'axios'
import jsonp from 'axios-jsonp'
import { Message } from 'element-ui'
import { getVelLevel } from '../../../util/windHelper'

import WindRadarDrawer from '../../../util/windRadarUtil'

let markerCollection = [],
  L = window['L']

@WithRender
@Component
export default class MountainFlood extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global

  loading = false
  productId = CONFIG.mountainFlood
  date: any = Date.now()
  reqUrl: string = 'http://10.148.16.217:11160/renyin5/warn/img/moun/city'
  imgUrl: string = ''

  created() {
    this.getImg()
    let momentHolder = moment(this.date)
    if(Number(momentHolder.format('HH')) < 20) {
      this.date = Number(momentHolder.subtract(1, 'days').format('x'))
    }
  }

  async getImg() {
    let src = 'http://10.148.16.217:11160/renyin5/warn/img/moun/city' +
      `?time=${moment(this.date).format('YYYY-MM-DD')} 00:00:00`
    this.imgUrl = src
  }

  @Watch('date')
  dateChanged(val: any, oldVal: any): void {
    this.getImg()
  }
}