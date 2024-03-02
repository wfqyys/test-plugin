/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { segment } from 'oicq'
import plugin from '../../../lib/plugins/plugin.js'

export class GuessIdiom extends plugin {
    constructor() {
        super({
            name: 'id',
            dsc: 'id',
            event: 'message',
            priority: Number.MIN_SAFE_INTEGER,
            rule: [
                {
                    reg: /^([#/]?获取当前群号)$/,
                    fnc: 'groupNumber'
                },
                {
                    reg: /^([#/]?(小姐姐|xjj)视频)$/,
                    fnc: 'video'
                }
            ]

        })
    }

    async groupNumber(e) {
        const id = e.group_id
        e.reply(typeof id)
    }
    async video(e) {
        const video_url = "http://api.yujn.cn/api/zzxjj.php"
        e.reply(["这是你要的视频", segment.video(video_url)])
    }
}
