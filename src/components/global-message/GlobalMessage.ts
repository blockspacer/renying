import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './GlobalMessage.html?style=./GlobalMessage.scss'

@WithRender
@Component
export default class GlobalMessage extends Vue {
  @Getter('systemStore/socketMessage_global') socketMessage_global: any[]
  @Getter('systemStore/socketCurrentMessage_global') socketCurrentMessage_global
  @Getter('systemStore/isSearchOperateStationWindowOn_global') 
    isSearchOperateStationWindowOn

  isShowHistoryMessage: boolean = false

  get socketMessage() {
    let message = this.socketMessage_global.slice(this.socketCurrentMessage_global.length - 2,
      this.socketMessage_global.length - 1)
    message.reverse()
    return message
  }
}



