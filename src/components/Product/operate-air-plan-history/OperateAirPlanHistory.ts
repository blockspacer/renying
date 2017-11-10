import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './OperateAirPlanHistory.html?style=./OperateAirPlanHistory.scss'
import * as moment from 'moment'
import * as CONFIG from '../../../config/productId'
import axios from 'axios'

@WithRender
@Component
export default class OperateAirPlanHistory extends Vue {
  @Getter('systemStore/articleViewHolder_global') articleViewHolder_global
  @Action('systemStore/changeArticleViewHolder_global') changeArticleViewHolder_global
  selectDate: Date = null
  productId = CONFIG.operateAirPlan
  provincePopup: boolean = false;
  countyPopup: boolean = false;
  cityPopup: boolean = false;
  minify: boolean = false;
  reqUrl: string = 'http://10.148.16.217:11160/renyin5/fp/word/records'
  optionData: any[] = []
  selectedOption: any = ''
  htmlUrl = ''
  htmlString = ''

  @Watch('selectedOption')
  async  onSelectedOptionChange(val) {
    for (let item of this.optionData) {
      if (val === item.id) {
        this.htmlUrl = item.message
        break
      }
    }
    this.getHtmlString()
  }

  async getHtmlString() {
    let res = await axios({
      url: this.htmlUrl,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    })
    this.htmlString = res.data
    console.info(this.htmlString)
  }


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
    this.optionData = []
    let res = await axios({
      url: this.reqUrl,
      params: {
        word: '33'
      }
    })
    for (let item of res.data) {
      this.optionData.push(Object.assign(item, { operateType: '' }))
    }
  }

}