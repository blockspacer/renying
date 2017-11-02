import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './OperateWarningGroundReportHistory.html?style=./OperateWarningGroundReportHistory.scss'

@WithRender
@Component
export default class OperateWarningGroundReportHistory extends Vue {
  @Getter('systemStore/articleViewHolder_global') articleViewHolder_global  
  @Action('systemStore/changeArticleViewHolder_global') changeArticleViewHolder_global
  selectDate: Date = null
  provincePopup:boolean = false;
  countyPopup:boolean = false;
  cityPopup:boolean = false;
  minify: boolean = false;
  
}