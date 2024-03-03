import fs from 'fs'

let Cwd = process.cwd().replace(/\\/g, '/')
let Version
logger.info(logger.magenta('-------------QwQ--------------'))
try {
  Version = await JSON.parse(fs.readFileSync(`${Cwd}/plugins/test-plugin/package.json`, 'utf-8'))
} catch (err) {
  Version = { version: '0.0.1' }
}
logger.info(logger.magenta(`----test-plugin插件【${Version.version}】初始化中------`))
const files = fs.readdirSync('./plugins/test-plugin/apps').filter(file => file.endsWith('.js'))
let ret = []
files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})
ret = await Promise.allSettled(ret)
let apps = {}
let APackageFanError = 0
for (let i in files) {
  let name = files[i].replace('.js', '')
  if (ret[i].status !== 'fulfilled') {
    logger.error(`[test-plugin]载入JS错误：${logger.red(name)}`)
    const ARegexFan = /Cannot find package '([^']+)'/
    let AFanReaSon = ret[i].reason + ''
    const AMatchFan = AFanReaSon.match(ARegexFan)
    if (AMatchFan) {
      logger.warn(`请先在${logger.red('plugins/test-plugin')}目录运行：${logger.red('pnpm install')}安装依赖`)
      logger.error(AFanReaSon)
      APackageFanError++
    } else {
      logger.error(ret[i].reason)
    }
    delete apps[name]
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
logger.info(logger.magenta('----test-plugin插件载入完成------'))
if (APackageFanError > 0) {
  logger.warn(logger.yellow('---请按提示安装依赖，否则对应功能会无效喵！------'))
  logger.warn(logger.yellow('---请按提示安装依赖，否则对应功能会无效喵！------'))
}

export { apps }
