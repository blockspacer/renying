import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MakeCard.html?style=./MakeCard.scss'

@WithRender
@Component
export default class MakeCard extends Vue {
  @Prop() closeFn
  @Prop() userMsg 

  userInfo: any = {}

  mounted() {
    this.userInfo = { ...this.userMsg }
  }
}