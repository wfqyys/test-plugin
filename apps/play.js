import createMarkdownMessage from '../models/createMarkdownMessage.js';
import { segment } from 'oicq'
import plugin from "../../../lib/plugins/plugin.js";

export class example extends plugin {
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
    async play(e) {
        let img_url = "https://gchat.qpic.cn/gchatpic_new/0/0-0-26EBB681B605E858ED28A8B0C970D73A/0";
        let text_start = "原神！启动！\r"
        let text_end = "\r都给爷去玩原神！！"
        const file = segment.image(img_url)
        const md = await createMarkdownMessage("", text_start, img_url, text_end);
        // const md = await createMarkdownMessage(file, text_start, "", text_end);
        const button = this.button;
        const msg = [md, button];
        if (e.self_id == 2854208819) {
            e.reply(msg);
        } else {
            return true;
        }
    }
}