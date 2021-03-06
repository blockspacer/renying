import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MicroRadiation.html?style=./MicroRadiation.scss'

@WithRender
@Component
export default class MicroRadiation extends Vue {
  dataType: string = null
  imgType: string = null
  toggleDataType(key) {
    this.dataType = key
  }
  imgTypeCon: string[] = ['t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000','t_20170807090000',]
  toggleImgType(key) {
    this.imgType = key
  }
}