import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './LeftnavAnalyze.html?style=./LeftnavAnalyze.scss'
import { secondMenuClassName, thridMenuClassName } from './menuClassNameConfig'

import * as CONFIG from '../../config/productId'

@WithRender
@Component
export default class LeftnavAnalyze extends Vue {
  @Getter('systemStore/subMenu_global') subMenu_global
  @Getter('systemStore/productViewHolder_global') productViewHolder_global
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  @Getter('systemStore/articleViewHolder_global') articleViewHolder_global 
  @Action('systemStore/changeArticleViewHolder_global') changeArticleViewHolder_global 
  

  secondMenuClassName = secondMenuClassName
  thridMenuClassName = thridMenuClassName

  leftNavSelected: number = null
  leftNavSubSelected: string = null
  thridMenuSelected: number = null
  articletView: any = null
  hideIconPopup: boolean = false
  isNavExtended: boolean = true

  // 二级菜单
  toggleleftNav(opt, bool) {
    if (bool) {
      this.isNavExtended = true
      this.leftNavSelected = opt.id
    } else {
      if(opt.url)
        window.open(opt.url)
      else
        this.leftNavSelected = this.leftNavSelected  === opt.id ? null : opt.id
    }

  }
  @Watch('leftNavSelected')
  isleftNavSelectedChanged (val, oldVal) {
    if (!this.productViewHolder_global[val] && val)
      this.toggleProductView_global({ id: val, action: true })
    if (this.productViewHolder_global[oldVal] && oldVal)
      this.toggleProductView_global({ id: oldVal, action: false })
    this.leftNavSubSelected = null
    this.changeArticleViewHolder_global({id: null,type: null})
    this.thridMenuSelected = null
  }

  // 文档菜单
  toggleArticle(type, key) {
    this.leftNavSubSelected = this.leftNavSubSelected === type ? null : type
    this.changeArticleViewHolder_global({id: key,type: this.leftNavSubSelected})
    // switch(this.leftNavSubSelected) {
    //   case 'create': this.articletView = CreatearticlePopup; break;       // 生成文档
    //   case 'history': this.articletView = HistoryarticlePopup; break;     // 历史文档
    //   default: this.articletView = null
    // }
  }

  // 三级菜单
  toggleSubNav(item, opt) {       // opt 为二级菜单
    if (opt)
      this.leftNavSelected = opt.id
    setTimeout(() => {
      if(item.url)
        window.open(item.url)
      else
        this.thridMenuSelected = this.thridMenuSelected === item.id ? null : item.id
    }, 0)
  }
  @Watch('thridMenuSelected')
  isthridMenuSelectedChanged (val, oldVal) {
    if (!this.productViewHolder_global['3-' + val] && val)
      this.toggleProductView_global({ id: '3-' + val, action: true })
    if (this.productViewHolder_global['3-' + oldVal] && oldVal)
      this.toggleProductView_global({ id: '3-' + oldVal, action: false })
  }

  // 关闭窗口时 关闭菜单选中
  @Watch('productViewHolder_global')
  onproductViewHolder_globalChanged(val: any, oldVal: any): void {
    if(this.leftNavSelected) {
      if (!val[this.leftNavSelected]) this.leftNavSelected = null
    }
    if (this.thridMenuSelected) {
      if (!val['3-' + this.thridMenuSelected]) this.thridMenuSelected = null
    }
  }

  // 关闭文档窗口时 关闭菜单选中
  @Watch('articleViewHolder_global')
  onarticleViewHolder_globalChanged(val: any, oldVal: any): void {
    if (!val.type) this.leftNavSubSelected = null
  }

  toggleHideChar() {
    this.isNavExtended = !this.isNavExtended
    this.$store.commit('systemStore/toggleLeftNavOpenState')
  }
}