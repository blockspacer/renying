import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import * as Config from '../../../config/productId'
import WithRender from './OperatePotentialPublish.html?style=./OperatePotentialPublish.scss'
import PublishDocument from '../../commons/publish-document/PublishDocument'
import SelectToggle from '../../commons/select-toggle/SelectToggle'
import { Message } from 'element-ui'
import * as moment from 'moment'

import axios from 'axios'
import jsonp from 'axios-jsonp'

@WithRender
@Component({
  components: {
    SelectToggle
  }
})
export default class OperatePotentialPublish extends Vue {
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
  plOperateData: any[] = []
  datetime = moment().format('YYYY-MM-DD HH:mm:ss')
  utcSelected = 0
  forecastOptionData = (() => {
    let arr = []
    for (let i = 1; i <= 48; i++) {
      arr.push(i < 10 ? '00' + i : (i < 100 ? '0' + i : i))
    }
    return arr
  })()
  forecastOptionSelected = '01'
  prescriptionOptionData = ['08', '20']
  prescriptionSelected = '08'
  latOptionData = [19, 22, 24, 26, 28, 30]
  latOptionSelected = 22
  htmlString = ''
  htmlStringHolder = ''
  docData
  docDataReqUrl = 'http://10.148.16.217:9020/doc/4?&data='
  imgPrefix = 'http://10.148.16.217:9020/dao/png?&path='

  created() {
    this.getOperateData()
  }

  mounted() {
    this.Editor = window['wangEditor']
    this.editor = new this.Editor('#editor')
    this.editor.create()

    axios({
      url: '/static/technical_papers/OperatePotential.html',
    }).then(async res => {
      this.htmlStringHolder = res.data
      await this.getDocData()
      this.replaceHTMLString()
    })
  }

  @Watch('prescriptionSelected')
  async onPrescriptionSelectedChange(val) {
    await this.getDocData()
    this.replaceHTMLString()
  }
  @Watch('datetime')
  async onDatetimeSelectedChange(val) {
    await this.getDocData()
    this.replaceHTMLString()
  }
  @Watch('forecastOptionSelected')
  async onForecastOptionSelectedSelectedChange(val) {
    await this.getDocData()
    this.replaceHTMLString()
  }
  @Watch('latOptionSelected')
  async onLatOptionSelectedSelectedChange(val) {
    await this.getDocData()
    this.replaceHTMLString()
  }

  replaceHTMLString() {
    this.htmlString = this.htmlStringHolder.replace(/datetime/, this.docData.time)
      .replace(/year/g, this.docData.year)
      .replace(/datetime/, this.docData.time)
      .replace(/imgSrc1/, this.imgPrefix + this.docData.png2Visl)
      .replace(/imgSrc2/, this.imgPrefix + this.docData.png3Qvtc)
      .replace(/imgSrc3/, this.imgPrefix + this.docData.png4Qvtr)
      .replace(/imgSrc4/, this.imgPrefix + this.docData.png5Rain3_6)
      .replace(/imgSrc5/, this.imgPrefix + this.docData.png6Rain3_12)
      .replace(/imgSrc6/, this.imgPrefix + this.docData.png7Rain3_24)
      .replace(/imgSrc7/, this.imgPrefix + this.docData.png8Rain3_48)
      .replace(/imgSrc8/, this.imgPrefix + this.docData.png1Cband)
    this.editor.txt.html(this.htmlString)
  }

  async getDocData() {
    let res = await axios({
      url: this.docDataReqUrl + 
        `{"datetime": "${moment(this.datetime).format('YYYY-MM-DD HH:mm:ss')}";` + 
      `"lat": "${this.latOptionSelected}"}`,
      adapter: jsonp
    })
    this.docData = res.data
  }

  latChange(val) {
    this.latOptionSelected = val
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
    res = await axios({
      url: this.operateReqUrl,
      params: {
        type: 'pl'
      }
    })
    this.plOperateData = res.data.data
  }


  publishDocument(workStation, appGroup, extraInfoText, operateType) {
    this.publishDocumentView = null
    this.$store.dispatch('systemStore/socketSendMessage_global', JSON.stringify({
      mark: operateType,
      osId: workStation,
      stage: 2,
      message: `<html><head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        </head><body>` +  
      this.editor.txt.html() + `</body></html>`,
      note: extraInfoText,
      // userIds: [],
      groupIds: appGroup,
      word: '20'
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
    console.info(this.editor.txt.html())
    /*     let res = await axios({
          url: this.htmlToDocUrl,
          method: 'post',
          headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
            message: this.editor.txt.html()
          }
        }) */
    let downloadEle = <HTMLAnchorElement>document.createElement('a')
    // downloadEle.download = res.data
    downloadEle.click()
  }

  pickFile() {
    let ele = <HTMLInputElement>document.querySelector('#uploadFile')
    ele.click()
  }

  async uploadFileChange(e) {
    let res = await axios({
      method: 'post',
      url: this.docToHtml,
      data: {
        message: e.srcElement.files[0]
      }
    })
    this.editor.txt.html(res.data.data)
  }
}