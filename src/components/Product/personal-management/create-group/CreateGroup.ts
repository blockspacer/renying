import Vue from 'vue'
import { Component, Watch, Prop} from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './CreateGroup.html?style=./CreateGroup.scss'
import { groupsClient } from '../../../../util/clientHelper'

@WithRender
@Component
export default class CreateGroup extends Vue {
  @Prop() closeFn
  @Prop() getGroup
  @Prop() group
  groupingName: string = '' 
  modifyGroupSelected: any = null

  mounted() {
    this.initData()
  }

  initData() {
    let arr = this.group.slice()
    for (let item of arr) {
      this.$set(item, 'isPopupOn', false)
      this.$set(item, 'inputPopup', false)
    }
    this.modifyGroupSelected = arr
  }
  
  async createGroup() {
    if (!this.groupingName) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '分组名称不得为空'
      })
      return
    }
    let data = await groupsClient.addGroup(this.groupingName)
    if (data) {
      this.getGroup()
    }
    else
      Vue.prototype['$message']({
        type: 'warning',
        message: '创建分组失败'
      })
  }

  @Watch('group')
  ongroupChanged (val: any, oldVal: any) {
    this.initData()
  }


  toggleRename(item) {
    item.inputPopup = true
    item.isPopupOn = false
  }
  async renameBtn(item){
    item.inputPopup = false
    let data = await groupsClient.renameGroup(item.groupId, item.groupName)
    if (data) {
      this.getGroup()
    }
    else
      Vue.prototype['$message']({
        type: 'warning',
        message: '修改失败'
      })
  }
  deleteGroup(item) {
    Vue.prototype['$confirm']('是否删除该分组?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let data = await groupsClient.deleteGroup(item.groupId)
      if (data) {
        this.getGroup()
      }
      else
        Vue.prototype['$message']({
          type: 'warning',
          message: '删除失败'
        })
    }).catch(() => {})
  }
}