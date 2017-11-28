import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './DownloadImg.html?style=./DownloadImg.scss'
import SelectToggle from '../../commons/select-toggle/SelectToggle'
import * as moment from 'moment'
@WithRender
@Component({
  components: {
    SelectToggle
  }
})

export default class DownloadImg extends Vue {
  moment = moment
  @Prop() closeFn
  forecastDate: any = []
  productDate: any = null
  modifyPop: boolean = false
  modifyInfo: any = {}
  utcSelected: number = 0
  forecastOptionData = []
  forecastOptionDatas= []
  scopeList: any = {
    SouthChina: '华南',
    GuangDong: '广东',
    SingleStation: '单站',
    Rainnest: '雨窝'
  }
  products: any[] = [
    {
      key: 'g9',
      name: 'GRAPES中尺度模式产品',
      forecasts: (() => {
        let arr = []
        for (let i = 0; i <= 168; i++) {
          arr.push(i < 10 ? '00' + i : (i < 100 ? '0' + i : i))
        }
        return arr
      })(),
      forecastsNum: 1,
      startForecast: '000',
      endForecast: '000',
      areas: ['SouthChina', 'GuangDong', 'SingleStation', 'Rainnest'],
      areasSelected: 'SouthChina',
      hours: ['00', '06', '12', '18'],
      startDate: new Date(),
      startHour: '00',
      endDate: new Date(),
      endHour: '00',
      products: ['mslp', 'mslp24','t2mm','t2mm24','wind10m','rain3','rain6','rain24','rain48','rain72','rain24stablization','t-td-surf','kiki','si','cape','surfparameters', 'tz-omeg','tz-wind-rhum','tz-windzthse','Tlogp','tlogp','surfparameters','tzZomeg','tzZwindZrhum','tzZwindZthse','tlogp'],
      singleStationCountys: ['59287', '59284', '59285', '59294', '59481', '59082', '57988', '57989', '57996', '59081', '59090', '59094', '59097', '59483', '59488', '59487', '59316', '59318',  '59319', '59324', '59279', '59288', '59480',  '59473', '59475', '59476', '59477', '59478', '59673', '59658', '59650', '59654', '59656', '59750', '59754', '59659', '59456', '59653', '59655', '59664', '59264', '59269', '59270', '59271', '59276', '59278 ', '59290', '59297', '59298', '59492', '59117', '59106', '59109', '59114', '59116', '59303', '59310', '59501', '59500', '59502','59293', '59096', '59099', '59107', '59304',  '59663', '59469 ', '59280', '59071', '59072', '59074', '59075', '59087', '59088', '59289', '59485', '59312', '59313', '59315', '59306', '59314', '59317', '59471', '59268' , '59462', '59470'],
      rainnestCountys: ['mm01jd', 'mm02bj', 'mm03mg', 'mm04xd', 'mm05cp','yj01hk', 'yj02pg','jm01df', 'jm02sj', 'jm03cx','sw01ml', 'sw02hk', 'sw03kt','hz01lm', 'hz02bp', 'hz03gt', 'jy01hc','qy01st', 'qy02tp', 'qy03qg'],
      productSelected: false
    }, {
      key: 'g1',
      name: 'GRAPES_1KM',
      forecasts: (() => {
        let arr = []
        for (let i = 0; i <= 360; i += 12) {
          arr.push(i < 10 ? '00' + i : (i < 100 ? '0' + i : i))
        }
        return arr
      })(),
      forecastsNum: 12,
      startForecast: '000',
      endForecast: '000',
      hours: (() => {
        let arr = []
        for (let i = 0; i <= 23; i++) {
          arr.push(i < 10 ? '0' + i : i)
        }
        return arr
      })(),
      minutes: (() => {
        let arr = []
        for (let i = 0; i <= 54; i += 6) {
          arr.push(i < 10 ? '0' + i : i)
        }
        return arr
      })(),
      startDate: new Date(),
      startHour: '00',
      startMinute: '00',
      endDate: new Date(),
      endHour: '00',
      endMinute: '00',
      products:['mslp','temp2m','rh2m_wind10m','rain12min','wind10m','rain1h','cref',],
      productSelected: false
    }, {
      key: 'g3',
      name: 'GRAPES短临(3km)',
      forecasts: (() => {
        let arr = []
        for (let i = 0; i <= 24; i++) {
          arr.push(i < 10 ? '00' + i : (i < 100 ? '0' + i : i))
        }
        return arr
      })(),
      forecastsNum: 1,
      startForecast: '000',
      endForecast: '000',
      hours: (() => {
        let arr = []
        for (let i = 0; i <= 23; i++) {
          arr.push(i < 10 ? '0' + i : i)
        }
        return arr
      })(),
      areas: ['SouthChina', 'GuangDong'],
      areasSelected: 'SouthChina',
      startDate: new Date(),
      startHour: '00',
      endDate: new Date(),
      endHour: '00',
      products:['mslp', 'temp2m','wind10m','rain1h','rain3h','rain6h','dbzr','wind925hght925','wind850hght500','wind700hght700','wind500hght500temp500','wind200stream200hght200','temp850-500', 'temp700-500', 'rhum500','rhum850','rhum925','vflux850', 'vflux925','kiki','sweat','tti', 'epi',],
      productSelected: false
    }, {
      key: 'h8',
      name: '葵花8红外灰度图',
      areas: ['SouthChina', 'GuangDong'],
      areasSelected: 'SouthChina',
      startDate: new Date(),
      startHour: '00',
      endDate: new Date(),
      endHour: '00',
      products:['inf_bw', 'inf_col', 'vap_bw', 'vis_3ch', 'vis_col', 'vis_bw'],
      productSelected: false
    },{
      key: 'ec',
      name: 'ECWMF细网格模式产品',
      forecasts: (() => {
        let arr = []
        for (let i = 0; i <= 240; i += 3) {
          arr.push(i < 10 ? '00' + i : (i < 100 ? '0' + i : i))
        }
        return arr
      })(),
      forecastsNum: 3,
      startForecast: '000',
      endForecast: '000',
      areas: ['SouthChina', 'GuangDong', 'SingleStation', 'Rainnest'],
      areasSelected: 'SouthChina',
      hours: ['00', '06', '12', '18'],
      startDate: new Date(),
      startHour: '00',
      endDate: new Date(),
      endHour: '00',
      products: ['mslp','mslp24','t2mm','t2mm24','t2mm-max','t2mm-min','t2mm-ave','wind10mslp','10gust3','10gust6','rain3','rain6','rain24','rain48','rain72','rain24stablization','t-td-surf','si','kiki','cape','temp24500','temp24850','temp850-500','temp700-500','hghtwind500', 'hght24500','500hght-850wind-rain','wind200stream200hght200','wind500hght500temp500','wind700','wind850hght500','wind850','wind925','rhum500','rhum700','rhum850','vflux850','vflux925','-td850','wind700jet200','windshear','thse50-850','omeg500','omeg700','omeg850','dive200', 'dive700','dive850','dive925','vort500','500vad-rain','vadv850','vadv925','tadv500', 'tadv850','tadv925',],
      singleStationCountys: ['59287', '59284', '59285', '59294', '59481', '59082', '57988', '57989', '57996', '59081', '59090', '59094', '59097', '59483', '59488', '59487', '59316', '59318',  '59319', '59324', '59279', '59288', '59480',  '59473', '59475', '59476', '59477', '59478', '59673', '59658', '59650', '59654', '59656', '59750', '59754', '59659', '59456', '59653', '59655', '59664', '59264', '59269', '59270', '59271', '59276', '59278 ', '59290', '59297', '59298', '59492', '59117', '59106', '59109', '59114', '59116', '59303', '59310', '59501', '59500', '59502','59293', '59096', '59099', '59107', '59304',  '59663', '59469 ', '59280', '59071', '59072', '59074', '59075', '59087', '59088', '59289', '59485', '59312', '59313', '59315', '59306', '59314', '59317', '59471', '59268' , '59462', '59470'],
      rainnestCountys: ['mm01jd', 'mm02bj', 'mm03mg', 'mm04xd', 'mm05cp','yj01hk', 'yj02pg','jm01df', 'jm02sj', 'jm03cx','sw01ml', 'sw02hk', 'sw03kt','hz01lm', 'hz02bp', 'hz03gt', 'jy01hc','qy01st', 'qy02tp', 'qy03qg'],
      productSelected: false
    }, {
      key: 'fy2',
      name: '人影卫星云反演产品',
      hours: (() => {
        let arr = []
        for (let i = 0; i <= 23; i++) {
          arr.push(i < 10 ? '0' + i : i)
        }
        return arr
      })(),
      startDate: new Date(),
      startHour: '00',
      endDate: new Date(),
      endHour: '00',
      products: ['ttop', 'ztop', 'hsc', 'optn','ref', 'lwp','tbb'],
      productSelected: false
    },{
      key: 'cpe',
      name: 'CPEFS本地化云模式产品',
      forecasts: (() => {
        let arr = []
        for (let i = 0; i <= 48; i ++) {
          arr.push(i < 10 ? '00' + i : (i < 100 ? '0' + i : i))
        }
        return arr
      })(),
      forecastsNum: 1,
      startForecast: '000',
      endForecast: '000',
      hours: ['08', '20'],
      startDate: new Date(),
      startHour: '00',
      endDate: new Date(),
      endHour: '00',
      products: ['cband','vil','visl','cloudtopt','cloudtoph','cloudboth','cloudbott','dbz' ,'rh','rainnc','QCLOUD','QRAIN','QICE','QSNOW','QGRAUP','QNICE','QNRAIN','QNSNOW','QNGRAUPEL','Qvtc','Qvtr','rain1','rain3','rain6','rain12','rain24'],
      levs1: [400,450,500,550,600,650,700,750,800,850],
      levs2: [19,22,24,26,28,30],
      productSelected: false
    },
  ]
  
  created() {
    let endTime = moment()
    let startTime = moment().subtract(1, 'days')
    this.forecastDate = [startTime, endTime]
  }

  @Watch('forecastDate')
  onforecastDateChanged (val: any, oldVal: any) {
    for (let el of this.products) {
      el.startDate = val[0]
      el.endDate = val[1]
    }
  }

  toggleUtcTime(key) {
    this.utcSelected = key
  }
  toggleModify(el) {
    this.modifyInfo = el
    this.modifyPop = true
  }
  startHourChange(e) {
    this.modifyInfo.startHour = e
  }
  endHourChange(e) {
    this.modifyInfo.endHour = e
  }
  startMinuteChange(e) {
    this.modifyInfo.startMinute = e
  }
  endMinuteChange(e) {
    this.modifyInfo.endMinute = e
  }
  startForecastChange(e) {
    this.modifyInfo.startForecast = e
  }
  endForecastChanges(e) {
    this.modifyInfo.endForecast = e
  }

  async downloadServiceGraph() {    //批量下载业务图
    let flag = false
    for (let el of this.products) {
      if (el.productSelected) {
        flag = true
        break
      }
    }
    if (!flag) {
      Vue.prototype['$message']({
        type: 'warning',
        message: '请至少选择一种产品'
      })
      return
    }
    let string = `starttime=${moment(this.forecastDate[0]).format('YYYY-MM-DD 00:00:00')}&endtime=${moment(this.forecastDate[1]).format('YYYY-MM-DD 00:00:00')}`
    for (let el of this.products) {
      if (!el.productSelected) continue
      let key = el.key
      let starttime = moment(el.startDate).format('YYYY-MM-DD ') + el.startHour + ':' + (el.startMinute ? el.startMinute : '00') + ':00'
      let endtime = moment(el.endDate).format('YYYY-MM-DD ') + el.endHour + ':' + (el.endMinute ? el.endMinute : '00') + ':00'
      let forecasts = ''
      if (el.forecasts) {
        forecasts = `&${key}.forecasts=`
        let s = Number(el.startForecast)
        let e = Number(el.endForecast)
        let num = el.forecastsNum
        for (let i = s; i <= e; i += num) {
          forecasts += i + ','
        }
        forecasts = forecasts.slice(0, -1)
      }
      let area = el.areasSelected ? `&${key}.area=${el.areasSelected}` : ''
      let countys = ''
      if (el.areasSelected === 'SingleStation')
        countys = `&${key}.countys=` + el.singleStationCountys.join(',')
      else if (el.areasSelected === 'Rainnest')
      countys = `&${key}.countys=` + el.rainnestCountys.join(',')
      let levs1 = el.levs1 ? `&${key}.levs1=${el.levs1.join(',')}` : ''
      let levs2 = el.levs2 ? `&${key}.levs2=${el.levs2.join(',')}` : ''
      string += `&${key}.starttime=${starttime}&${key}.endtime=${endtime}&${key}.products=${el.products.join(',')}${forecasts}${area}${countys}${levs1}${levs2}`
    }
    console.log(`http://10.148.16.217:11160/renyin5/conn/images/all?${string}`)
    window.open(`http://10.148.16.217:11160/renyin5/conn/images/all?${string}`)

  } 
  toggleProduct(el) {
    el.productSelected = !el.productSelected
  }
}