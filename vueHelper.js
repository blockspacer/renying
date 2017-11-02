let shell = require('shelljs')
let fs = require('fs')
let os = require('os')
let argv = require('yargs')
  .command("compt", "make component", function (yargs) {
    let argv = yargs.reset()
      .option('d', {
        alias: 'dir',
      })
      .option('n', {
        alias: 'name'
      })
      .argv

    deterDir(argv)

    let uppperCasePosition = getUpperCasePos(argv.n)
    let nameString = argv.n,
      foldName = '',
      positionHolder = 0
    nameString.toLowerCase()
    for (let i = 1; i <= uppperCasePosition.length; i++) {
      foldName += nameString.substring(positionHolder, uppperCasePosition[i]) + '-'
      positionHolder = uppperCasePosition[i]
    }
    foldName = foldName.substring(0, foldName.length - 1)
    foldName = foldName.toLocaleLowerCase()
    if (shell.which(foldName)) {
      shell.echo('already has this component!')
      shell.exit(1)
    } else {
      shell.mkdir(foldName)
      shell.pushd(foldName)
    }

    shell.touch(argv.n + '.ts')
    shell.touch(argv.n + '.html')
    shell.touch(argv.n + '.scss')

    writeComptFiles(argv.n)

    shell.echo('generate file successed!')
    shell.exit(1)
  })
  .command("store", "make store", function (yargs) {
    let argv = yargs.reset()
      .option('d', {
        alias: 'dir',
      })
      .option('n', {
        alias: 'name'
      })
      .argv

    deterDir(argv)

    shell.mkdir(argv.n)
    shell.pushd(argv.n)
    shell.touch('index.ts')
    shell.touch('state.ts')
    shell.touch('getters.ts')
    shell.touch('actions.ts')
    shell.touch('mutations.ts')

    writeStoreFiles(argv.n)

    shell.echo('generate file successed!')
    shell.exit(1)

  })
  .argv;

shell.echo('please input a command: compt or store')
shell.exit(1)

function deterDir(argv) {
  if (!argv.d) {
    shell.echo('empty dir path')
    shell.exit(1)
  }
  if (!argv.n) {
    shell.echo('empty component name')
    shell.exit(1)
  }

  if (!shell.which(argv.d)) {
    let dirArr
    if (argv.d.match('/'))
      dirArr = argv.d.split('/')
    else if (argv.d.match('\\'))
      dirArr = argv.d.split('\\')
    else {
      shell.exit(1)
    }

    let dirString = ''
    for (let i = 0; i < dirArr.length; i++) {
      if (!fs.existsSync(dirArr[i]))
        shell.mkdir(dirArr[i])
      shell.pushd(dirArr[i])
    }
  }
}

function getUpperCasePos(string = '') {
  let strArr = string.split(''),
    position = []
  for (let i = 0; i < strArr.length; i++) {
    if (/^[A-Z]+$/.test(strArr[i])) {
      position.push(i)
    }
  }
  return position
}

function writeStoreFiles(storeName) {
  let indexCode = [
    "import { Module, GetterTree, MutationTree, ActionTree } from 'vuex'",
    "import { State } from './state'",
    "import Mutations from './mutations'",
    "import Getters from './getters'",
    "import Actions from './actions'",
    `export default class ${storeName} implements Module<State, any> {`,
    "namespaced: boolean = true",
    "",
    "state: State",
    "mutations = Mutations",
    "getters = Getters",
    "actions = Actions",
    "",
    "constructor() {",
    "  this.state = new State()",
    "}"
  ],
    stateCode = [
      "export class State {",
      "",
      "}"
    ],
    getterCode = [
      "import { Getter, GetterTree } from 'vuex'",
      "import { State } from './state'",
      "",
      "export default <GetterTree<State, any>> {",
      "",
      "}"
    ],
    actionCode = [
      "import { Store, ActionTree, ActionContext } from 'vuex'",
      "import { State } from './state'",
      "",
      "export default <ActionTree<State, any>> {",
      "",
      "}"
    ],
    mutationCode = [
      "import { Getter, GetterTree } from 'vuex'",
      "import { State } from './state'",
      "",
      "export default <GetterTree<State, any>> {",
      "",
      "}"
    ]

  indexCode.forEach(el => {
    fs.appendFileSync('index.ts', el)
    fs.appendFileSync('index.ts', os.EOL)
  })
  getterCode.forEach(el => {
    fs.appendFileSync('getters.ts', el)
    fs.appendFileSync('getters.ts', os.EOL)
  })
  actionCode.forEach(el => {
    fs.appendFileSync('actions.ts', el)
    fs.appendFileSync('actions.ts', os.EOL)
  })
  mutationCode.forEach(el => {
    fs.appendFileSync('mutations.ts', el)
    fs.appendFileSync('mutations.ts', os.EOL)
  })
  stateCode.forEach(el => {
    fs.appendFileSync('state.ts', el)
    fs.appendFileSync('state.ts', os.EOL)
  })
}

function writeComptFiles(comptName) {
  let tsCode = [
    "import Vue from 'vue'",
    "import { Component, Watch } from 'vue-property-decorator'",
    "import { Action, Getter } from 'vuex-class'",
    `import WithRender from './${comptName}.html?style=./${comptName}.scss'`,
    "",
    "@WithRender",
    "@Component",
    `export default class ${comptName} extends Vue {`,
    "",
    "}"
  ],
    htmlCode = [
      `<main id="${comptName}">`,
      "",
      "</main>"
    ]

  tsCode.forEach(el => {
    fs.appendFileSync(comptName + '.ts', el)
    fs.appendFileSync(comptName + '.ts', os.EOL)
  })

  htmlCode.forEach(el => {
    fs.appendFileSync(comptName + '.html', el)
    fs.appendFileSync(comptName + '.ts', os.EOL)
  })
}