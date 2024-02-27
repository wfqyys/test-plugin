import createMarkdownMessage from '../models/createMarkdownMessage.js';
import { segment } from 'oicq'
import plugin from "../../../lib/plugins/plugin.js";
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import makeConfig from "../../../lib/plugins/config.js"
import { rulePrefix } from '../models/common.js'
const { config, configSave } = await makeConfig("bot_id",
    {
        permission: "master",
        bot_id: [],
    },
)
// async function ensureConfigFileAndLoad() {
//     const __filename = fileURLToPath(import.meta.url);
//     const configDir = path.resolve(path.dirname(__filename), '..', 'config');
//     const configPath = path.join(configDir, 'play.yml');

//     try {
//         // 检查 play.yml 是否存在
//         await fs.access(configPath, fs.constants.F_OK);

//         // 加载 play.yml 配置文件
//         const configData = await fs.readFile(configPath, 'utf8');
//         const config = yaml.load(configData);

//         // 检查bot_id是否配置
//         if (!config || !config.bot_id) {
//             console.log('bot_id is not configured in config/play.yml');
//         }

//         return config;
//     } catch (error) {
//         // 如果文件不存在或bot_id未配置，则创建并写入默认配置
//         if (error.code === 'ENOENT') {
//             const defaultConfig = { bot_id: '' };
//             await fs.writeFile(configPath, yaml.dump(defaultConfig), 'utf8');
//             return defaultConfig;
//         } else {
//             logger.error(error);
//         }
//     }
// }

export class PlayGenshinImpact extends plugin {
    // 构造函数
    constructor() {
        super({
            name: "play genshin impact",
            dsc: "play genshin impact",
            event: "message",
            priority: Number.MIN_SAFE_INTEGER,
            rule: [
                {
                    reg: /^[#/]?(原神|genshin impact)(,|，)?(启动|start)(!|！)$/,
                    fnc: "play",
                }, {
                    reg: /^(test|插件)?设置bot_id:\d+$/,
                    fnc: "setId",
                    permission: config.permission
                },
            ],
        });
        this.button = segment.button(
            [
                { text: "pc点击下载", link: "https://ys-api.mihoyo.com/event/download_porter/link/ys_cn/official/pc_default" }
            ],
            [
                { text: "android点击下载", link: "https://ys-api.mihoyo.com/event/download_porter/link/ys_cn/official/android_default" }
            ],
            [
                { text: "ios点击下载", link: "https://ys-api.mihoyo.com/event/download_porter/link/ys_cn/official/ios_default" }
            ],
            [
                { text: "拉Buer进群", link: "https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0" },
                { text: "拉Buer进频道", link: "https://qun.qq.com/qunpro/robot/share?robot_appid=102042175" },
            ],
        )
    }
    //废弃此法，留作纪念
    async play1(e) {
        let img_url = "https://gchat.qpic.cn/gchatpic_new/0/0-0-26EBB681B605E858ED28A8B0C970D73A/0";
        let text_start = "## 原神！启动！\r"
        let text_end = "\r都给爷去玩原神！！"
        const file = segment.image(img_url)
        const md = await createMarkdownMessage("", text_start, img_url, text_end);
        // const md = await createMarkdownMessage(file, text_start, "", text_end);
        const button = this.button;
        const msg = [md, button];
        if (e.self_id == config.bot_id) {
            e.reply(msg);
        } else {
            return true;
        }
    }
    async play(e) {
        let img_url = "https://gchat.qpic.cn/gchatpic_new/0/0-0-26EBB681B605E858ED28A8B0C970D73A/0";
        let text_start = "## 原神！启动！\r";
        let text_end = "\r都给爷去玩原神！！\r> 快把我拉进你的群聊和你一起玩吧！";
        const img = segment.image(img_url);
        const button = this.button;
        const msg = [text_start, img, text_end, button];
        if (e.self_id == config.bot_id) {
            e.reply(msg);
        } else {
            return true;
        }
    }
    async setId() {
        const botId = this.e.msg.replace(/^(test|插件)?设置bot_id:/, "").trim();
        if (!botId) {
            this.reply('无效的输入格式，请按照“设置bot_id<数字>”的格式输入', true);
            return;
        }
        // 覆盖原有配置中的bot_id值
        config.bot_id = botId;
        // 保存新的配置
        await configSave();
        this.reply(`bot_id已成功设置为${botId}，重启后生效`, true);
    }

}
export default PlayGenshinImpact;