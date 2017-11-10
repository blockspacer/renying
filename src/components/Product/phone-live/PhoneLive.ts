import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PhoneLive.html?style=./PhoneLive.scss'

import * as CONFIG from '../../../config/productId'
let player,
  streamer
@WithRender
@Component({
})
export default class GrapesMode extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  @Getter('systemStore/phoneLiveId_global') phoneLiveId_global
  productId = CONFIG.phoneLive
  mounted() {
    let _this = this
    window['setSWFIsReady'] = function () {
      player = <any>document.getElementById('rtmp-player')
      player.play('rtmp://119.29.102.103:9096/oflaDemo', _this.phoneLiveId_global)
    }
  }
}