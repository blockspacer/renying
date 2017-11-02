import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './AmmunitionInternet.html?style=./AmmunitionInternet.scss'
import * as CONFIG from '../../../config/productId'
import { AmmunitionInternetClient, geoClient } from '../../../util/clientHelper'
import moment from 'moment'

@WithRender
@Component
export default class AmmunitionInternet extends Vue {
  moment = moment
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  productId: string = CONFIG.ammunitionInternet
  keyString: string = ''
  ammunitionCounty: string = ''
  addModifyStorePop: boolean = false
  appuserTypePop: boolean = false
  addStoreTitle: any = {
    id: { value: null },
    name: { name: '名称', value: null },
    lon: { name: '经度', value: null },
    lat: { name: '纬度', value: null },
    level: { name: '级别', value: null },
    region: { name: '请选择', value: null },
  }
  repositoryList: any = []
  addStoreLists: any = []
  popupType: 'add' | 'modify' = null
  cityList: any = []
  allAmmunitionList: any = []         //仓库弹药弹药箱列表
  selAmmunitionList: any = []         //筛选后仓库弹药弹药箱列表
  selectedRepository: string = null         //选中仓库Id
  usageList: any = []                  //炮弹用途
  usageSelected: string = ''

  mounted() {
    this.getRepository()
    this.geoClient()
    this.ammunitionCounty = 'all'


  }
  async geoClient() {       //获取地址信息
    let data = await geoClient.getCities()
    if (!data) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '获取地址失败'
      })
      return
    }
    this.cityList = data
  }
  async getRepository() {                       //获取仓库信息列表
    let data = await AmmunitionInternetClient.getRepository()
    if (!data) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '获取数据失败'
      })
      return
    }
    for (let item of data) {
      this.$set(item, 'popup', false)   //给item对象添加popup属性 用于判断窗口状态
      // 获取数量
      let data = await AmmunitionInternetClient.getAmmunitionMsg(item.id)
      if (!data || !data.length) {
        this.$set(item, 'number', 0)
        continue
      }
      let number = 0
      for (let el of data) {
        if (el.code.slice(0, 2) === '02') number++
        else number += 4
      }
      this.$set(item, 'number', number)
    }
    this.repositoryList = data
    this.addStoreLists = data
    this.toggleAmmunition(data[0].id)
    this.usageSelected = '全部'
  }

  async updateRepository() {    //添加 修改仓库
    let data, tip = ''
    let param: any = {
      id: this.addStoreTitle.id.value,
      name: this.addStoreTitle.name.value,
      level: this.addStoreTitle.level.value,
      lon: this.addStoreTitle.lon.value,
      lat: this.addStoreTitle.lat.value,
      region: this.addStoreTitle.region.value,
      manager: ["刘敏", "陈波", "奥巴马"]
    }
    if (this.popupType === 'add') {
      param.valid = true
      tip = '新增'
      data = await AmmunitionInternetClient.addRepository(param)
      this.addStoreTitle.id.value = ''
      this.addStoreTitle.name.value = ''
      this.addStoreTitle.lon.value = ''
      this.addStoreTitle.lat.value = ''
      this.addStoreTitle.level.value = ''
      this.addStoreTitle.region.value = ''
    } else if (this.popupType === 'modify') {
      tip = '修改'
      data = await AmmunitionInternetClient.modifyRepository(param)
    }
    if (data) {
      Vue.prototype['$message']({
        type: 'success',
        message: tip + '成功'
      })
      this.popupType = null
      this.addModifyStorePop = false
      this.getRepository()
    } else
      Vue.prototype['$message']({
        type: 'error',
        message: tip + '失败'
      })
  }

  async deleteRepository(id) {   //删除仓库
    Vue.prototype['$confirm']('是否确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let data = await AmmunitionInternetClient.deleteRepository(id)
      if (data) {
        Vue.prototype['$message']({
          type: 'success',
          message: '删除成功'
        })
        this.getRepository()
      } else {
        Vue.prototype['$message']({
          type: 'error',
          message: '删除失败'
        })
      }
    }).catch(() => { })
  }

  toggleEditor(item) {
    this.geoClient()
    let status = item.popup
    for (let el of this.repositoryList) {
      el.popup = false
    }
    item.popup = !status
  }
  toggleModifyStoreHouse(item) {               //修改仓库
    this.addStoreTitle.id.value = item.id
    this.addStoreTitle.name.value = item.name
    this.addStoreTitle.lon.value = item.lon
    this.addStoreTitle.lat.value = item.lat
    this.addStoreTitle.level.value = item.level
    this.addStoreTitle.region.value = item.region
    this.popupType = 'modify'
    this.addModifyStorePop = true
  }
  addStoreHouse() {                   //新建仓库
    if (this.popupType === 'add') {
      this.popupType = null
      this.addModifyStorePop = false
    } else {
      this.popupType = 'add'
      this.addModifyStorePop = true
    }
  }

  toggleAppuserType() {
    this.appuserTypePop = !this.appuserTypePop
  }
  matchList(key) {            //搜索过滤
    this.addStoreLists = []
    for (let el of this.repositoryList) {
      let isMatch: boolean = false
      for (let i in el as string[]) {
        if (i === 'lon' || i === 'id' || i === 'lat' || i === 'level' || i === 'manager') continue
        if (el[i].includes(key)) {
          isMatch = true
          break
        }
      }
      if (isMatch) this.addStoreLists.push(el)
    }
  }
  @Watch('keyString')
  onkeyStringChanged(val: any, oldVal: any) {
    this.matchList(val)
  }
  @Watch('ammunitionCounty')
  onammunitionCountyChanged(val: any, oldVal: any) {
    if (val === 'all') this.matchList('')
    else this.matchList(val)
  }
  async getAmmunitionBox() {  //获取弹药箱
    let data = await AmmunitionInternetClient.getAmmunitionBox()
    if (!data) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '弹药箱数据获取失败'
      })
      return
    }
  }
  async getAmmunition() {  //获取弹药
    let data = await AmmunitionInternetClient.getAmmunition()
    if (!data) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '弹药箱数据获取失败'
      })
      return
    }
  }
  async getAmmunitionMsg(id) {  //获取仓库的所有弹药、弹药箱信息
    let data = await AmmunitionInternetClient.getAmmunitionMsg(id)
    if (!data) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '弹药箱数据获取失败'
      })
      return
    }

    this.allAmmunitionList = data
    this.selAmmunitionList = data
    console.log(this.allAmmunitionList)
    this.usageList = []
    for (let item of this.allAmmunitionList) {        //炮弹用途列表
      if (this.usageList.indexOf(item.usage) === -1)
        this.usageList.push(item.usage)
    }
  }
  toggleAmmunition(id) {
    this.getAmmunitionMsg(id)
    this.selectedRepository = id
  }
  toggleUsage(key) {       //炮弹用途筛选按钮
    this.usageSelected = key
    this.selAmmunitionList = []

    for (let item of this.allAmmunitionList) {
      if (key === '全部') {
        this.selAmmunitionList = this.allAmmunitionList
      } else {
        if (item.usage === key) this.selAmmunitionList.push(item)
      }
    }
    console.log(this.selAmmunitionList)
    this.appuserTypePop = false
  }
}







