import { segment } from 'oicq'
import plugin from "../../../lib/plugins/plugin.js";

export class chaijun extends plugin {
    constructor(e) {
        super({
            name: '随机柴郡',
            dsc: '随机柴郡',
            event: 'message',
            priority: Number.MIN_SAFE_INTEGER,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: /^(#|\/)?随机(柴郡|chaijun|HMS Cheshire)$/,
                    /** 执行方法 */
                    fnc: 'chaijun',
                }
            ]
        });
        this.button = segment.button([{ text: '+1', input: '随机柴郡', send: true },],)
    }
    async chaijun(e) {
        const url = "http://api.yujn.cn/api/chaijun.php?";
        const text = "## 柴郡\r";
        // const text_end = "[点我加群聊](https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0)";
        const img = segment.image(url)
        // const msg = [text, img, text_end, this.button]
        const msg = [text, img, this.button]
        e.reply(msg);
    }
}