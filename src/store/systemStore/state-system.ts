import {

} from '../mutation-types'
import axios from 'axios'
import jsonp from 'axios-jsonp'

export class State {
  constructor() {
    this.getAppGroupData().then(data => {
      this.appGroupData = data
    })
    this.getWorkStationData().then(data => {
      this.operateStationData = data
    })
    this.getAllMember().then(data => {
      this.appUserData = data
    })
  }
  userInfo: any = {}
  subMenu: any[] = []

  productViewHolder: any = {}
  articleViewHolder: any = {
    id: null,
    type: null
  }
  isClosingPopup: boolean = false
  isMenuChanged: boolean = false    // 改变时更改目录
  isSecondMenuChanged: boolean = false

  // 是否打开作业点搜索按钮
  isSearchOperateStationWindowOn: boolean = false
  // 侧边导航栏是否展开
  isLeftNavOpened: boolean = true

  socket: WebSocket = null
  socketIntervalHolder: any = null
  socketMessage: any[] = []
  socketCurrentMessage: any = ''
  freshOperate: any = ''

  // #todo 每个修改app人员 作业点 人员群组的都要更新全局仓库的数据
  // 作业点
  operateStationData: any[] = []
  // 人员群组
  appGroupData: any[] = []
  // app账户人员
  appUserData: any[] = []

  isDisasterManageImg: boolean = false   //灾情管理
  disasterMsg: any = {}

  isCappiProfileOn: boolean = false
  cappiProfile: any = { SLat: null, SLon: null, ELat: null, ELon: null }      // 雷达剖面
  async  getWorkStationData() {
    let res = await axios({
      url: this.workStationRequestUrl,
      adapter: jsonp
    })
    return res.data.data
  }

  async  getAppGroupData() {
    let res = await axios({
      url: this.appGroupRequestUrl,
      adapter: jsonp
    })
    return res.data.data
  }

  async getAllMember() { //获取全部成员列表
    let res: any = await axios({
      url: `http://10.148.16.217:11160/renyin5/appuser/selectAll`,
      adapter: jsonp,
    })
    return res.data.data
  }

  workStationRequestUrl = 'http://10.148.16.217:11160/renyin5/fp/operation/finds'
  appGroupRequestUrl = 'http://10.148.16.217:11160/renyin5/webuser/group'
}
