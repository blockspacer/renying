import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import * as Config from '../../../config/productId'
import WithRender from './OperateDemandAnalysisPublish.html?style=./OperateDemandAnalysisPublish.scss'
import PublishDocument from '../../commons/publish-document/PublishDocument'
import { OperateClient } from '../../../util/operateClient'
import { Message } from 'element-ui'

import axios from 'axios'
import jsonp from 'axios-jsonp'

@WithRender
@Component
export default class OperateDemandAnalysisPublish extends Vue {
  @Getter('systemStore/articleViewHolder_global') articleViewHolder_global
  @Action('systemStore/changeArticleViewHolder_global') changeArticleViewHolder_global
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  minify: boolean = false;
  // productId = Config.
  Editor
  editor
  publishDocumentView = null

  mounted() {
    this.Editor = window['wangEditor']
    this.editor = new this.Editor('#editor')
    this.editor.create()

    axios({
      url: '/static/technical_papers/OperateDemandAnalysis.html?_=' + Date.now(),
    }).then(res => {
      this.editor.txt.html(res.data)
    })
  }

  /*   publishDocument(workStation, appGroup, extraInfoText) {
      this.publishDocumentView = null
      this.$store.dispatch('systemStore/socketSendMessage_global', JSON.stringify({
        mark: '#all',
        // osId: workStation,
        stage: 0,
        message: this.editor.txt.html(),
        note: extraInfoText,
        // userIds: [],
        groupIds: appGroup
      }))
    } */

  openPublishDocumentPopup() {
    // this.publishDocumentView = (this.publishDocumentView === null ? PublishDocument : null)
    this.$store.dispatch('systemStore/socketSendMessage_global', JSON.stringify({
      mark: '#all',
      // osId: workStation,
      stage: 0,
      message: this.editor.txt.html(),
      // note: extraInfoText,
      // userIds: [],
      // groupIds: appGroup
    }))
    Message({
      type: 'success',
      message: '发布成功'
    })
  }

  async downloadFile() {
    OperateClient.downloadFile(this.editor.txt.html())
  }

  async uploadFileChange(e) {
    OperateClient.uploadFile(e.srcElement.files[0])
      .then(html => {
        console.error('html', html)
        this.editor.txt.html(html)
      })
  }

  pickFile() {
    let ele = <HTMLInputElement>document.querySelector('#uploadFile')
    ele.click()
  }

}