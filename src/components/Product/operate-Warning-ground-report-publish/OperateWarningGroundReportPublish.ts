import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { OperateClient } from '../../../util/operateClient'
import * as Config from '../../../config/productId'
import WithRender from './OperateWarningGroundReportPublish.html?style=./OperateWarningGroundReportPublish.scss'
import PublishDocument from '../../commons/publish-document/PublishDocument'
import { Message } from 'element-ui'
import * as moment from 'moment'
import SelectToggle from '../../commons/select-toggle/SelectToggle'

import axios from 'axios'
import jsonp from 'axios-jsonp'

@WithRender
@Component({
  components: {
    SelectToggle
  }
})
export default class OperateWarningGroundReportPublish extends Vue {
  @Getter('systemStore/articleViewHolder_global') articleViewHolder_global
  @Action('systemStore/changeArticleViewHolder_global') changeArticleViewHolder_global
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  minify: boolean = false;
  // productId = Config.
  Editor
  editor
  publishDocumentView = null
  htmlToDocUrl = 'http://10.148.16.217:11160/renyin5/fp/files/html/converter'
  docToHtml = 'http://10.148.16.217:11160/renyin5/fp/files/doc/converter'
  operateReqUrl = 'http://10.148.16.217:11160/renyin5/fp/exists'
  rkOperateData: any[] = []
  stationOptionData = [
    '清远', '河源', '汕头', '阳江'
  ]
  obtidData = [
    { id: 59280, name: '清远' },
    { id: 59293, name: '河源' },
    { id: 59316, name: '汕头' },
    { id: 59663, name: '阳江' }
  ]
  airLineSelected = '清远'
  datetime = moment().format('YYYY-MM-DD HH:mm:ss')
  htmlString = ''
  htmlStringHolder = ''
  docData
  docDataReqUrl = 'http://10.148.16.217:9020/doc/5?&data='
  imgPrefix = 'http://10.148.16.217:9020/dao/png?&path='

  created() {
    this.getOperateData()
  }

  mounted() {
    this.Editor = window['wangEditor']
    this.editor = new this.Editor('#editor')
    this.editor.customConfig.uploadImgShowBase64 = true
    this.editor.create()

    axios({
      url: '/static/technical_papers/OperateWarningGroundReport.html',
    }).then(async res => {
      this.htmlStringHolder = res.data
      await this.getDocData()
      this.replaceHTMLString()
    })
  }

  @Watch('datetime')
  async onDatetimeSelectedChange(val) {
    await this.getDocData()
    this.replaceHTMLString()
  }
  @Watch('stationOptionSelected')
  async onstationOptionSelectedSelectedChange(val) {
    await this.getDocData()
    this.replaceHTMLString()
  }

  replaceHTMLString() {
    this.htmlString = this.htmlStringHolder.replace(/datetime/, this.docData.time)
      .replace(/year/g, this.docData.year)
      .replace(/gdCity/g, this.docData.gdCity)
      .replace(/imgSrc1/, this.imgPrefix + this.docData.png1Ttop)
      .replace(/imgSrc2/, this.imgPrefix + this.docData.png2Optn)
      .replace(/imgSrc3/, this.imgPrefix + this.docData.png3Ice)
      .replace(/imgSrc4/, this.imgPrefix + this.docData.png4Tlog)
      .replace(/imgSrc5/, this.imgPrefix + this.docData.png5Vil)
      .replace(/imgSrc6/, this.imgPrefix + this.docData.png6Mtop)
      .replace(/imgSrc7/, this.imgPrefix + this.docData.png7RadarProfile)
      .replace(/imgSrc8/, this.imgPrefix + this.docData.png8Ztop)
    this.editor.txt.html(this.htmlString)
  }

  async getDocData() {
    let res = await axios({
      url: this.docDataReqUrl + `{"datetime": "${moment(this.datetime).format('YYYY-MM-DD HH:mm:ss')}"}`,
      adapter: jsonp
    })
    this.docData = res.data
  }

  airLineDesignChange(val) {
    this.airLineSelected = val
  }

  close() {
    this.publishDocumentView = null
  }

  async getOperateData() {
    let res = await axios({
      url: this.operateReqUrl,
      params: {
        type: 'rk'
      }
    })
    this.rkOperateData = res.data.data
  }

  publishDocument(workStation, appGroup, extraInfoText, operateType) {
    this.publishDocumentView = null
    this.$store.dispatch('systemStore/socketSendMessage_global', JSON.stringify({
      mark: operateType,
      osId: workStation,
      stage: 0,
      message: `<html><head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        </head><body>` +
        this.editor.txt.html() + `</body></html>`,
      note: extraInfoText,
      // userIds: [],
      groupIds: appGroup,
      word: '30'
    }))
    Message({
      type: 'success',
      message: '发布成功'
    })
  }

  openPublishDocumentPopup() {
    this.publishDocumentView = (this.publishDocumentView === null ? PublishDocument : null)
  }

  async getHtmlString() {
    OperateClient.downloadFile(this.editor.txt.html())
  }

  pickFile() {
    let ele = <HTMLInputElement>document.querySelector('#uploadFile')
    ele.click()
  }

  async uploadFileChange(e) {
    OperateClient.uploadFile(e.srcElement.files[0])
      .then(html => {
        this.editor.txt.html(html)
      })
  }
}