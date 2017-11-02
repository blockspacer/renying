import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PersonalManagement.html?style=./PersonalManagement.scss'
import * as CONFIG from '../../../config/productId'
import CreateGroup from './Create-group/CreateGroup'
import EditorMessage from './editor-message/EditorMessage'
import MakeCard from './make-card/MakeCard'
import { groupsClient } from '../../../util/clientHelper'
@WithRender
@Component
export default class PersonalManagement extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  productId: string = CONFIG.personalManagement
  groupSelected: number = null;
  createGroupView: any = null
  editorMessageView: any = null
  makeCardView: any = null
  createPopup: boolean = true;
  groupsListPopup:boolean = false
  userMsg: any = {}
  
  allPsnList: any = []          // 总的 用户数据
  personList: any = []          // 显示的 用户数据
  currentPageList: any = []     // 当前页数 用户数据
  pageSize: number = 11
  currentPage: number = 1       // 当前页数
  keyString: string = ''
  
  group: any =[]   //分组名称

  mounted(){
   this.getGroup()
   
  }
  async getGroup(){
    let data = await groupsClient.getGroup()
    console.log(data)
    if (!data || !data.length) return
    for (let opt of data) {
      for (let item of opt.appUsers) {
        item.selected = false
      }
    }
    this.group = data
    // this.groupSelected = data[0].groupId
    // this.personList = data[0].appUsers
    this.toggleAll()
  }
  async toggleAll(){
    this.groupsListPopup = false
    this.groupSelected = null
    let data = await groupsClient.getAllMember()
    for (let el of data) {
      el.userName = el.username
      el.selected = false
    }
    this.allPsnList = data
    this.personList = data
    this.currentPage = 1
    this.currentPageList = this.personList.slice(0, this.pageSize)
  }

  toggleGroup(item){
    this.groupsListPopup = false
    if(this.groupSelected === item.groupId) return
    this.groupSelected = item.groupId
    this.allPsnList = item.appUsers
    this.personList = item.appUsers
    this.currentPage = 1
    this.currentPageList = this.personList.slice(0, this.pageSize)    
  }
  
  toggleCheckPerson(key) {
    this.personList[key].selected = !this.personList[key].selected
  }
  toggleCreateGroup() {
    this.createGroupView = this.createGroupView ? null : CreateGroup
    this.createPopup= this.createPopup ? false : true
  }
  toggleEditor(item) {
    this.userMsg = item
    this.editorMessageView = this.editorMessageView ? null : EditorMessage
  }
  toggleMakeCard(item) {
    this.userMsg = item
    this.makeCardView = this.makeCardView ? null : MakeCard
  }
  currentChange(e) {
    this.currentPage = e
    this.currentPageList = this.personList.slice(this.pageSize*(e-1), this.pageSize*(e-1) + this.pageSize)
  }
  @Watch('keyString')
  onkeyStringChanged (val: any, oldVal: any) {
    this.personList = []
    for (let el of this.allPsnList) {
      let isMatch: boolean = false
      let exp = new RegExp(val)
      for (let i in el) {
        if (i === 'password' || i === 'id' || i === 'userid') continue
        if (exp.test(el[i])) {
          isMatch = true
          break
        }
      }
      if (isMatch) this.personList.push(el)
    }
    this.currentPage = 1
    this.currentPageList = this.personList.slice(0, this.pageSize)
  }
}