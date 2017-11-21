import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MakeCard.html?style=./MakeCard.scss'
import Card from './CardImage'

@WithRender
@Component
export default class MakeCard extends Vue {
  @Prop() closeFn
  @Prop() userMsg
  @Prop() saveCard

  userInfo: any = {}
  path: String = '默认照片'
  generated: boolean = false

  mounted() {
    this.userInfo = {
      ...this.userMsg,
      date: new Date().toLocaleDateString(),
      no: '',
      area: '广东省行政区域范围',
      period: '五年',
      imageUrl: 'http://10.148.16.217:11160/renyin5/appuser/' + this.userMsg.imageUrl,
    }
  }

  changePhoto(e) {
    let file = e.target.files[0]
    if (!file) return
    this.path = file.name
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e: any) => {
      this.userInfo.imageUrl = e.target.result
      console.log(this.userInfo.imageUrl)
    }
  }

  upload() {
    document.getElementById('file').click()
  }

  dataURLtoBlob(dataurl): Blob {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  makeCard() {
    let card = new Card(this.userInfo, this.userInfo.imageUrl, '/static/img/stamp.png')
    card.onload = imgUrl => {
      (<HTMLImageElement>document.getElementById('card')).src = imgUrl
      let downloaBtn = <HTMLAnchorElement>document.getElementById('download')
      downloaBtn.href = imgUrl
      downloaBtn.download = `${this.userInfo.name}的工作证`
      this.saveCard(this.userMsg, this.dataURLtoBlob(imgUrl))
    }
    card.gen()
  }
}
