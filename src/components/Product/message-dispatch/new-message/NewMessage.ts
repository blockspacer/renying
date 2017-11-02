import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './NewMessage.html?style=./NewMessage.scss'
import { groupsClient, messageDispatchClient } from '../../../../util/clientHelper'
@WithRender
@Component
export default class NewMessage extends Vue {
  @Getter('systemStore/userInfo_global') userInfo_global
  groupWordSelected: string = 'group'
  groups: any =[]   //分组列表
  selectedPeople: any = {}
  addresseeList: any = ''  //收信人
  msgContent: string = ''  // 短信内容
  keyString: string = ''  //搜索
  searchList = []      //搜索列表
  mounted(){
    this.getGroup()
  }
  @Watch('keyString')
  onkeyStringChanged (val: any, oldVal: any) {
    this.searchList = []
    let isMatch: boolean = false
    let exp = new RegExp(val)
    for(let el of this.groups){
      for(let item of el.appUsers){
        if(exp.test(item.username))
          this.searchList.push(item)
      }
    }
  }
  toggleGroupWord(key) {
    if(this.groupWordSelected === key) return
    this.groupWordSelected =  key
  }
   
  async getGroup(){           //获取分组成员
    let data = await groupsClient.getGroup()
    if (!data || !data.length) return
    for (let opt of data) {
      for (let item of opt.appUsers) {
        item.selected = false
      }
      this.$set(opt, 'show', false)
    }
    this.groups = data
    console.log(this.groups)
  }

  toggleCheckPeople(item) {
    if(item.id in this.selectedPeople) 
      delete this.selectedPeople[item.id]
    else
      this.selectedPeople[item.id] =  item
    this.selectedPeople = { ...this.selectedPeople }
    let list = []
    for (let i in this.selectedPeople) {
      list.push(this.selectedPeople[i].username)
    }
    this.addresseeList = list.join('; ')
  }

  async sendMsg() {
    if (!this.msgContent) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '短信内容不得为空'
      })
      return
    }
    if (!Object.keys(this.selectedPeople).length) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '请选择至少一个收信人'
      })
      return
    }
    let list = [] 
    for(let i in this.selectedPeople){
      list.push( { phone: this.selectedPeople[i].phone, id: i } )
    }
    let param = {
      msgContent: this.msgContent,
      sender: this.userInfo_global.id,
      list,
    }
    let res = await messageDispatchClient.getmsgSend(param)
    if (res) {
      Vue.prototype['$message']({
        type: 'success',
        message: '发送成功'
      })
      this.msgContent = ''
    } else {
      Vue.prototype['$message']({
        type: 'warning',
        message: '发送失败'
      })
    }
  }
}