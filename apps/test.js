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
                }
            ]// 改为一个对象存储不同群组的当前问题
        })
    }

    async groupNumber(e) {
        const id = e.group_id
        e.reply(typeof id)
    }
}
