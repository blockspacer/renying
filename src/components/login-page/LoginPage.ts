import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './LoginPage.html?style=./LoginPage.scss'

import { userClient } from '../../util/clientHelper'
import { CookieHelper } from '../../util/cookie'
import { Message } from 'element-ui'

let layer = null

@WithRender
@Component
export default class LoginPage extends Vue {
  @Action('systemStore/changeUserInfo_global') changeUserInfo_global

  @Prop() closeLoginPage

  placeholderUser: string = '账号'
  placeholderPwd: string = '密码'
  username: string = null
  password: string = null
  displayMsg: boolean = false
  isLoginSuccessed: boolean = true

  created() {
  }

  async login() {
    let data = await userClient.login(this.username, this.password)
    if (data) {
      this.isLoginSuccessed = false
      this.changeUserInfo_global(data)
      CookieHelper.setCookie('login', `${this.username}%${this.password}`, 7)
      Message({
        type: 'success',
        message: '成功登陆'
      })
      this.closeLoginPage()
    } else {
      this.displayMsg = true
      Message({
        type: 'error',
        message: '用户名密码错误'
      })
    }
  }
}