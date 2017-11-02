import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './HistoryMessage.html?style=./HistoryMessage.scss'

@WithRender
@Component
export default class HistoryMessage extends Vue {
  articleList = {
    art: {
      title: '主题主题主题主题主题主题主题主题主题',
      date: '2017/09/27',
      con: '气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害气象灾害气象灾害气象灾害气象灾害气象灾害气象灾害气象灾害气象灾害。'
      }
  }
  email = {
    addressee: '张三',
    tel: '18354654241',
    con: '气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害是指气象灾害气象灾害气象灾害气象灾害气象灾害气象灾害气象灾害气象灾害气象灾害。'
  }
 
}