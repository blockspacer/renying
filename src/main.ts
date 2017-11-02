// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import store from './store'
import App from './App'

import './util/fontSize'
import './styles/main.scss'
import './styles/divIcon.scss'
import './styles/global-popup.scss'
import './directive'

import {
  Tooltip,
  Loading,
  DatePicker,
  Message,
  MessageBox,
  pagination,
  Slider,
  Transfer,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Steps,
  Step,
} from 'element-ui'

Vue.use(Loading)
Vue.use(DatePicker)
Vue.use(Tooltip)
Vue.use(pagination)
Vue.use(Slider)
Vue.use(Transfer)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Steps)
Vue.use(Step)
Vue.prototype['$message'] = Message
Vue.prototype['$confirm'] = MessageBox.confirm

// tslint:disable-next-line:no-unused-new
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
