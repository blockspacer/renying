import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './EditorMessage.html?style=./EditorMessage.scss'

@WithRender
@Component
export default class EditorMessage extends Vue {
  @Prop() closeFn
  @Prop() userMsg

  userInfo: any = {}
  mounted() {
    this.userInfo = { ...this.userMsg }
  }
}