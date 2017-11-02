import { Getter, GetterTree } from "vuex";
import { State } from './state-system'

export function userInfo_global(state: State) {
  return state.userInfo
}

export function subMenu_global(state: State) {
  return state.subMenu
}

export function productViewHolder_global (state: State): any {
  return state.productViewHolder
}

export function isClosingPopup_global (state: State): any {
  return state.isClosingPopup
}

export function articleViewHolder_global (state: State):any {
  return state.articleViewHolder
}

export function isMenuChanged_global (state: State): boolean {
  return state.isMenuChanged
}

export function isSecondMenuChanged_global (state: State):any {
  return state.isSecondMenuChanged
}

export function socketMessage_global (state: State): any {
  return state.socketMessage
}

export function isDisasterManageImg_global (state: State):any {
  return state.isDisasterManageImg
}

export function disasterMsg_global (state: State):any {
  return state.disasterMsg
}

export const cappiProfile_global = (state: State): any => state.cappiProfile

export function isCappiProfileOn_global (state: State):any {
  return state.isCappiProfileOn
}
export function socketCurrentMessage_global(state: State) {
  return state.socketCurrentMessage
}

export function isSearchOperateStationWindowOn_global (state: State): any {
  return state.isSearchOperateStationWindowOn
}

export function isLeftNavOpened_global(state: State) {
  return state.isLeftNavOpened
}

export function freshOperate_global (state: State): any {
  return state.freshOperate
}

export default <GetterTree<State, any>>{
  userInfo_global,
  subMenu_global,
  productViewHolder_global,
  isClosingPopup_global,
  articleViewHolder_global,
  isMenuChanged_global,
  isSecondMenuChanged_global,
  socketMessage_global,
  isDisasterManageImg_global,
  disasterMsg_global,
  socketCurrentMessage_global,
  isSearchOperateStationWindowOn_global,
  isLeftNavOpened_global,
  cappiProfile_global,
  isCappiProfileOn_global,
  freshOperate_global,
}
