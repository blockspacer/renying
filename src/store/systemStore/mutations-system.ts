import { Mutation, MutationTree } from "vuex";
import { State } from "./state-system";

import * as moment from 'moment'

export function changeUserInfo(state: State, userInfo: any) {
  state.userInfo = userInfo
}

export function changeSubMenu(state: State, action: any) {
  state.subMenu = action
}

export function toggleProductView(state: State, payload: { id: number, action: boolean }) {
  state.productViewHolder[payload.id] = payload.action
  state.productViewHolder = { ...state.productViewHolder }
}

export function closeProductView(state: State) {
  for (let i in state.productViewHolder)
    state.productViewHolder[i] = false
  state.productViewHolder = { ...state.productViewHolder }
  state.isClosingPopup = !state.isClosingPopup
}

export function changeArticleViewHolder(state: State, action: any) {
  state.articleViewHolder.id = action.id
  state.articleViewHolder.type = action.type
  state.articleViewHolder = { ...state.articleViewHolder }
}

export function storeMenuChanged(state: State) {
  state.isMenuChanged = !state.isMenuChanged
}

export function storeSecondMenuChanged(state: State) {
  state.isSecondMenuChanged = !state.isSecondMenuChanged
}

export function connectSocket(state: State, wsUrl: string = 'ws://10.148.16.217:11160/renyin5/ws') {
  state.socket = new WebSocket(wsUrl)
  state.socket.onmessage = e => {
    let messageData = parseReturnMessage(JSON.parse(e.data))
    state.socketMessage.push(messageData)
    state.socketCurrentMessage = messageData
  }
  state.socket.onclose = e => {
    state.socket = new WebSocket(wsUrl)
    state.socket.onmessage = e => {
      let messageData = parseReturnMessage(JSON.parse(e.data))
      state.socketMessage.push(messageData)
      state.socketCurrentMessage = messageData
    }
  }

  let socket = new window['SockJS']('http://10.148.16.217:11160/renying' + '/socket');
  this.stompClient = window['Stomp'].over(socket);
  this.stompClient.connect({}, frame => {
    this.stompClient.subscribe('/renying' + '/event', msg => {
      let event = JSON.parse(msg.body);
      console.info(event)
    });
  },
    err => {
      console.error(err)
    });
  function parseReturnMessage(data) {
    let msg = {
      type: '',
      color: 'operate',
      target: '',
      datetime: moment().format('YYYY/MM/DD HH:mm'),
      content: '',
      tooltipText: '指挥员 '
    }
    for (let item of state.operateStationData) {
      if (item.id === data.osId) {
        msg.target = item.appUser.name
        msg.tooltipText += item.appUser.phone
        break
      }
    }
    switch (data.stage) {
      case 0: msg.type = '需求分析'; break
      case 1: msg.type = '作业计划'; break
      case 2: msg.type = '作业潜力'; break
      case 3: msg.type = '作业预警'; break
      case 3: msg.type = '实时指挥'; break
      case 5: msg.type = '效果评估'; break
      default: msg.type = '五段流程'; break
    }
    if (data.stage == 0) {
      switch (data.state) {
        case 0: msg.content = '不响应'; break
        case 1: msg.content = '响应'; break
        default: msg.content = '等待'; break
      }
    } else {
      switch (data.state) {
        case 0: msg.content = '不作业'; break
        case 1: msg.content = '作业'; break
        default: msg.content = '等待'; break
      }
    }
    return msg
  }
}

export function toggleSearchOperateStation(state: State) {
  state.isSearchOperateStationWindowOn = !state.isSearchOperateStationWindowOn
}

export function updateAppGroupData(state: State, data) {
  state.appGroupData = data
}

export function updateOperateStationData(state: State, data) {
  state.operateStationData = data
}

export function socketSendMessage(state: State, message: any) {
  state.socket.send(message)
}

export function storeDisasterManageImg(state: State) {
  state.isDisasterManageImg = !state.isDisasterManageImg
}

export function storedisasterMsg(state: State, action: any) {
  state.disasterMsg = action
}

export function toggleLeftNavOpenState(state: State) {
  state.isLeftNavOpened = !state.isLeftNavOpened
}
export const storeCappiProfile = (state: State, data: { SLat: boolean, SLon: boolean, ELat: boolean, ELon: boolean }) => {
  state.cappiProfile.SLat = data.SLat
  state.cappiProfile.SLon = data.SLon
  state.cappiProfile.ELat = data.ELat
  state.cappiProfile.ELon = data.ELon
}

export function freshOperate (state: State) {
  state.freshOperate = Date.now() 
}

export function storeisCappiProfileOn(state: State, action: any) {
  state.isCappiProfileOn = action
}

export default <MutationTree<State>>{
  changeUserInfo,
  changeSubMenu,
  toggleProductView,
  closeProductView,
  changeArticleViewHolder,
  storeMenuChanged,
  storeSecondMenuChanged,
  connectSocket,
  socketSendMessage,
  storeDisasterManageImg,
  storedisasterMsg,
  storeCappiProfile,
  storeisCappiProfileOn,
  updateAppGroupData,
  updateOperateStationData,
  toggleSearchOperateStation,
  toggleLeftNavOpenState,
  freshOperate
}