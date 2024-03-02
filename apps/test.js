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
                }
            ]

        })
    }

    async groupNumber(e) {
        const id = e.group_id
        e.reply(typeof id)
    }
}
