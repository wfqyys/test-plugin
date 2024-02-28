import createMarkdownMessage from '../models/createMarkdownMessage.js';
import Config from '../components/Config.js';
import { segment } from 'oicq'
import plugin from "../../../lib/plugins/plugin.js";
import makeConfig from "../../../lib/plugins/config.js"
import { rulePrefix } from '../models/common.js'

//Bot 配置
const { config, configSave } = await makeConfig("bot_id",
    {
        permission: "master",
        bot_id: [],
    },
)

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
                    reg: /^[#/]?原神(,|，)?启动(!|！)$/,
                    fnc: "play",
                },
                {
                    reg: /^[#/]?genshin impact(,|，)?start(!|！)$/,
                    fnc: "play1",
                },
                {
                    reg: /^(test)?(插件)?设置bot_id:\d+$/,
                    fnc: "setId",
                    permission: config.permission
                },
                {
                    reg: /^(test)?(插件)?设置id:\d+$/,
                    fnc: "setConfig",
                },
                {
                    reg: /^(test)(插件)?删除id:\d+$/,
                    fnc: "delConfig",
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
        );
        this.config = Config;
        this.config.initialize();
    }
    //废弃此法，留作纪念
    async play1(e) {
        let img_url = "https://gchat.qpic.cn/gchatpic_new/0/0-0-26EBB681B605E858ED28A8B0C970D73A/0";
        let text_start = "## 原神！启动！\r";
        let text_end = "\r > 都给爷去玩原神！！\r快把我拉进你的群聊和你一起玩吧！";
        const img = segment.image(img_url);
        const button = this.button;
        // const md = await createMarkdownMessage("", text_start, img_url, text_end);
        // const md = await createMarkdownMessage(file, text_start, "", text_end);
        // const msg = [md, button];
        const msg = [text_start, img, text_end, button];
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
        const config = await Config.configData("play-config")
        if (e.self_id == config.bot_id) {
            e.reply(msg);
        } else {
            return true;
        }
    }

    //配置方法1
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

    //配置方法2
    async setConfig() {
        const Id = parseInt(this.e.msg.replace(/^(test|插件)?设置id:/, "").trim(), 10); // parseInt第二个参数10指定了基数为10，即十进

        if (!Id) {
            this.reply('无效的输入格式，请按照“设置id<数字>”的格式输入', true);
            return;
        }
        const currentBotIds = await Config.configData("play-config")

        // 检查 currentBotIds 是否已定义和非空
        if (currentBotIds === undefined || currentBotIds === null) {
            this.reply('配置文件中 bot_id 未定义或为空，请检查配置文件', true);
            return;
        }
        if (currentBotIds === Id) {
            currentBotIds = currentBotIds.filter(item => item !== Id);
            Config.reloadConfig("play-config");
            const ids = await Config.configData("play-config")
            this.reply(`bot_id:${ids}已删除，重启后生效`, true);
        } else {
            Config.setNumConfig('play-config', 'bot_id', Id, 'config');
            Config.reloadConfig("play-config");
            const ids = await Config.configData("play-config")
            this.reply(`bot_id已成功设置为${Id}，重启后生效`, true);
        }
    }
    async delConfig() {
        const Id = this.e.msg.replace(/^(test)(插件)?删除id:/, "").trim();

        if (!Id) {
            this.reply('无效的输入格式，请按照“设置id<数字>”的格式输入', true);
            return;
        }
        // 加载配置文件中的 bot_id 数组
        let currentBotIds = Config.getArrConfigValue('play-config', 'bot_id');

        // 如果配置文件中已有该 ID，则删除
        if (currentBotIds.includes(Id)) {
            // 使用 Config.setArr 方法删除 ID
            currentBotIds = currentBotIds.filter(item => item !== Id);
            Config.setArr('play-config', 'bot_id', -1, currentBotIds, 'config'); // 注意这里使用 -1 作为索引代表在数组末尾插入整个数组
            this.reply(`ID已删除，重启后生效，共${currentBotIds.length}个ID`, true);
        } else {
            this.reply("未找到此id")
        }
    }
}
export default PlayGenshinImpact;