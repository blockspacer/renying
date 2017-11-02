import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './OperateDemandAnalysisHistory.html?style=./OperateDemandAnalysisHistory.scss'

import axios from 'axios'
import jsonp from 'axios-jsonp'
import * as moment from 'moment'

@WithRender
@Component
export default class OperateDemandAnalysisHistory extends Vue {
  @Getter('systemStore/articleViewHolder_global') articleViewHolder_global
  @Action('systemStore/changeArticleViewHolder_global') changeArticleViewHolder_global
  selectDate: Date = null
  provincePopup: boolean = false;
  countyPopup: boolean = false;
  cityPopup: boolean = false;
  minify: boolean = false;
  reqUrl: string = 'http://10.148.16.217:11160/renyin5/fp/word/records'
  optionData: any[] = []
  selectedOption: any = ''

  year(data) {
    return moment(data.datetim).get('year')
  }
  month(data) {
    return moment(data.datetim).get('month')
  }

  created() {
    this.getHistoryData()
  }

  async getHistoryData() {
    let res = await axios({
      url: this.reqUrl,
      params: {
        type: 'wk',
      }
    })
    console.info(res.data)
    this.optionData = res.data
  }
}