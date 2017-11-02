import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PublishDocument.html?style=./PublishDocument.scss'

import axios from 'axios'
import jsonp from 'axios-jsonp'

@WithRender
@Component
export default class PublishDocument extends Vue {
  workStationRequestUrl = 'http://10.148.16.217:11160/renyin5/fp/operation/finds'
  appGroupRequestUrl = 'http://10.148.16.217:11160/renyin5/webuser/group'
  workStationData: {
    address: string
    county: string
    city: string
    id: string
    airport: string
    appUsers: any[]
  }[] = []
  appGroupData: { groupName: string, groupId: number, appUsers: any[] }[] = []
  appGroupDataHolder = []
  workStationDataHolder = []
  workStationSearchText = ''
  appGroupSearchText = ''
  workStationSelected = null
  appGroupSelected = []
  extraInfoText = ''
  operateType = '#rk'
  operateData = []
  textInputDelayHolder = null
  operateDataReqUrl: string = 'http://10.148.16.217:11160/renyin5/fp/exists'

  @Prop() publishFunction: Function
  @Prop() preWorkStationSelected
  @Prop() preAppGroupSelected
  @Prop() close
  @Prop() preOperateType: string
  @Prop() rkOperateData: any[]
  @Prop() plOperateData: any[]
  @Prop() stage: number

  created() {
    if (!this.preAppGroupSelected)
      this.getWorkStationData()
    if (!this.preWorkStationSelected)
      this.getAppGroupData()
    if (this.preOperateType)
      this.operateType = this.preOperateType
    this.getOperateData()
  }

  async getOperateData() {
    this.operateData = []
    let res = await axios({
      url: this.operateDataReqUrl,
      params: {
        type: 'rk'
      }
    })
    let arr = []
    for (let item of res.data.data) {
      arr.push(Object.assign(item, { type: 'rk' }))
    }
    this.operateData = this.operateData.concat(arr)
    res = await axios({
      url: this.operateDataReqUrl,
      params: {
        type: 'pl'
      }
    })
    arr = []
    for (let item of res.data.data) {
      arr.push(Object.assign(item, { type: 'pl' }))
    }
    this.operateData = this.operateData.concat(arr)
  }

  publish() {
    this.publishFunction(this.workStationSelected, this.appGroupSelected, this.extraInfoText, this.operateType)
  }
  selectAppGroup(id) {
    if (this.appGroupSelected.indexOf(id) !== -1) {
      for (let i in this.appGroupSelected) {
        if (this.appGroupSelected[i] === id) {
          this.appGroupSelected.splice(Number(i), 1)
          break
        }
      }
    } else {
      this.appGroupSelected.push(id)
    }
  }

  @Watch('operateType')
  operateTypeChanged(val: any, oldVal: any): void {
    if (val === '#rk' && this.rkOperateData) {
      this.workStationData = this.rkOperateData
    }
    if (val === '#pl' && this.plOperateData) {
      this.workStationData = this.plOperateData
    }
  }

  @Watch('workStationSearchText')
  workStationSearchTextChanged(val: string, oldVal: any): void {
    console.info(val)
    if (this.textInputDelayHolder) {
      clearTimeout(this.textInputDelayHolder)
    }
    if (val.length === 0)
      this.workStationDataHolder = this.workStationData
    else
      this.textInputDelayHolder = setTimeout(() => {
        this.workStationDataHolder = []
        this.workStationData.map((item, index) => {
          if (item.address.includes(val) || item.airport.includes(val) ||
            item.city.includes(val) || item.county.includes(val) || item.id.includes(val)) {
            this.workStationDataHolder.push(item)
          }
        })
        this.textInputDelayHolder = null
      }, 200)
  }
  @Watch('appGroupSearchText')
  appGroupSearchTextChanged(val: string, oldVal: any): void {
    console.info(val)
    if (this.textInputDelayHolder) {
      clearTimeout(this.textInputDelayHolder)
    }
    if (val.length === 0)
      this.appGroupDataHolder = this.appGroupData
    else
      this.textInputDelayHolder = setTimeout(() => {
        this.appGroupDataHolder = []
        this.appGroupData.map((item, index) => {
          if (item.groupId.toString().includes(val) || item.groupName.includes(val)) {
            this.appGroupDataHolder.push(item)
          }
        })
        this.textInputDelayHolder = null
      }, 200)
  }
  async getWorkStationData() {
    let res = await axios({
      url: this.workStationRequestUrl,
      adapter: jsonp
    })
    let filterData = [],
      filteredHolder = []
    if (this.rkOperateData) {
      filterData = this.rkOperateData
    } else if (this.plOperateData) {
      filterData = this.plOperateData
    }
    if (filterData.length > 0)
      for (let item of res.data.data) {
        for (let subItem of filterData) {
          if (subItem.wos.id === item.id &&
            (typeof this.stage !== undefined ? this.stage == subItem.stage : true)) {
            filteredHolder.push(item)
            break
          }
        }
      }
    else if (this.stage == 0)
      filteredHolder = res.data.data
    this.workStationData = filteredHolder
    this.workStationDataHolder = this.workStationData
  }

  async getAppGroupData() {
    let res = await axios({
      url: this.appGroupRequestUrl,
      adapter: jsonp
    })
    this.appGroupData = res.data.data
    this.appGroupDataHolder = this.appGroupData
  }
}



