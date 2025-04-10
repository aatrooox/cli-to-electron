import type { CliCmd } from "./components/CliCmdBar.vue"
export const cliCmds: CliCmd[] = [
  {
    name: '翻译',
    cmd: 'trans',
    args: [
      {
        flag: '-f',
        name: '指定文件',
        default: '',
        required: true,
        type: 'file'
      },
      {
        flag: '-d',
        name: '指定目录',
        default: '',
        required: true,
        type: 'dir'
      }
    ]
  },
  {
    name: '自动国际化',
    cmd: 'i18n',
    args: [
      {
        flag: '-f',
        name: '指定文件',
        default: '',
        required: true,
        type: 'file'
      },
      {
        flag: '-d',
        name: '指定目录',
        default: '',
        required: true,
        type: 'dir'
      }
    ]
  },
  {
    name: '配置',
    cmd: 'set',
    args: [
      {
        flag: ['translate', 'account.appId'],
        name: 'appId',
        default: '',
        required: true,
      },
      {
        flag: ['translate', 'account.key'],
        name: 'key',
        default: '',
        required: true,
      },
    ]
  },
]