import { PluginVersion, Config, yunzaiVersion } from '../components/index.js'

function scale(pct = 1) {
    let scale = Math.min(2, Math.max(0.5, Config.renderScale / 100))
    pct = pct * scale
    return `style=transform:scale(${pct})`
}

const Render = {
    async render(path, params, cfg = { retType: 'default' }) {
        let { e } = cfg
        if (!e.runtime) {
            console.log('未找到e.runtime，请升级至最新版Yunzai')
        }

        let BotName = 'Buer'
        return e.runtime.render('test-plugin', path, params, {
            retType: cfg.retType,
            beforeRender({ data }) {
                let pluginName = ''
                if (data.pluginName !== false) {
                    pluginName = ` & ${data.pluginName || 'test-plugin'}`
                    if (data.pluginVersion !== false) {
                        pluginName += `<span class="version">${data.pluginVersion || PluginVersion}`
                    }
                }
                let resPath = data.pluResPath
                const layoutPath = process.cwd() + '/plugins/test-plugin/resources/common/layout/'
                return {
                    ...data,
                    _res_path: resPath,
                    _test_path: resPath,
                    _layout_path: layoutPath,
                    _tpl_path: process.cwd() + '/plugins/test-plugin/resources/common/tpl/',
                    defaultLayout: layoutPath + 'default.html',
                    elemLayout: layoutPath + 'elem.html',
                    sys: {
                        scale: scale(cfg.scale || 1)
                    },
                    copyright: `Created By ${BotName}<span class="version">${yunzaiVersion}</span><span class="version">${pluginName || PluginVersion}</span>`,
                    pageGotoParams: {
                        waitUntil: 'networkidle2'
                    }
                }
            }
        })
    }
}

export default Render
