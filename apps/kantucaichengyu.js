/* eslint-disable indent */
import { segment } from 'oicq'
import plugin from '../../../lib/plugins/plugin.js'
import axios from 'axios'

const currentQuestions = new Map()

const Cbutton = segment.button(
    [
        {
            text: '猜',
            input: '/猜'
        }
    ],
    [
        {
            text: '拉Buer进群',
            link: 'https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0'
        },
        {
            text: '拉Buer进频道',
            link: 'https://qun.qq.com/qunpro/robot/share?robot_appid=102042175'
        }
    ]
)
const Lbtn = segment.button(
    [
        {
            text: '再来一题',
            input: '/开始看图猜成语',
            send: true
        }
    ],
    [
        {
            text: '拉Buer进群',
            link: 'https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0'
        },
        {
            text: '拉Buer进频道',
            link: 'https://qun.qq.com/qunpro/robot/share?robot_appid=102042175'
        }
    ]
)
let btn = segment.button(
    [
        {
            text: '猜错了，再猜一次',
            input: '/猜'
        },
        {
            text: '看答案',
            input: '/看答案',
            send: true
        }
    ],
    [
        {
            text: '拉Buer进群',
            link: 'https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0'
        },
        {
            text: '拉Buer进频道',
            link: 'https://qun.qq.com/qunpro/robot/share?robot_appid=102042175'
        }
    ]
)
let btn1 = segment.button(
    [
        {
            text: '开始游戏',
            input: '/开始看图猜成语',
            send: true
        }
    ],
    [
        {
            text: '拉Buer进群',
            link: 'https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0'
        },
        {
            text: '拉Buer进频道',
            link: 'https://qun.qq.com/qunpro/robot/share?robot_appid=102042175'
        }
    ]
)
export class guessSaying extends plugin {
    constructor() {
        super({
            name: '看图猜成语',
            dsc: '看图猜成语',
            event: 'message',
            priority: Number.MIN_SAFE_INTEGER,
            rule: [
                {
                    reg: /^([#/]?开始看图猜成语)$/,
                    fnc: 'startGame'
                },
                {
                    reg: /^([#/]?猜.*)$/,
                    fnc: 'guess'
                },
                {
                    reg: /^([#/]?看答案)$/,
                    fnc: 'lookDaan'
                }
            ]
        })
        this.startGame = this.startGame.bind(this)
        this.currentQuestions = currentQuestions
    }

    async startGame() {
        try {
            const groupId = this.e.group_id
            // const groupId = "123456789"
            console.log('groupId:', groupId)
            if (!groupId) {
                console.error('无法获取到群组ID')
                this.reply('无法获取群组ID，请确保在群聊内发送指令')
                return
            }
            // const api = ''http://api.yujn.cn/api/caicy.php?''
            const api = `https://xiaoapi.cn/API/game_ktccy.php?msg=%E5%BC%80%E5%A7%8B%E6%B8%B8%E6%88%8F&id=${groupId}`
            const response = await axios.get(api)
            const data = await response.data

            if (data.code === 200) {
                this.currentQuestions.set(groupId, {
                    // daan: data.daan,
                    // imageUrl: data.img
                    daan: data.data.answer,
                    imageUrl: data.data.pic
                })
                // const img = segment.image(data.img)
                const img = segment.image(data.data.pic)
                const textStart = '# 开始看图猜成语\r'
                const text = '请根据以下图片猜成语:\r'

                const msg = [textStart, text, img, Cbutton]
                this.reply(msg)
            } else {
                console.error(
                    `在群 ${groupId} 获取题目时发生错误:`,
                    data.message || '未知错误'
                )
                // 可以在这里添加回复用户一条错误信息的消息
                this.reply('抱歉，获取题目时出错，请稍后再试。') // 添加错误提示消息
            }
        } catch (error) {
            console.error(`在群 ${this.e.group_id} 请求过程中发生错误:`, error)
            // 可以在这里添加回复用户一条网络错误的信息
            this.e.reply('抱歉，网络请求出现问题，请稍后再试。') // 添加网络错误提示消息
        }
    }

    async guess(e) {
        const groupId = e.group_id
        const text1 = `群 ${groupId} 还没有开始新的猜成语游戏，请先输入“猜图猜成语”开始游戏。`

        if (!this.currentQuestions.has(groupId)) {
            const msg = [text1, btn1]
            e.reply(msg)
            return
        }

        const userAnswer = e.msg.replace(/^([#/]?猜)/, '').trim()

        if (
            userAnswer.toLowerCase() ===
            this.currentQuestions.get(groupId)?.daan.toLowerCase()
        ) {
            const text = `恭喜你，答对了！答案是：${this.currentQuestions.get(groupId)?.daan}`
            const img = segment.image(this.currentQuestions.get(groupId)?.imgUrl)
            const msg = [img, text, btn]
            e.reply(msg)
            this.currentQuestions.delete(groupId)
        } else {
            const text = `很遗憾，答案不是“${userAnswer}”哦~再好好想想吧~`
            const msg = [text, btn]
            e.reply(msg)
        }
    }

    async lookDaan(e) {
        const groupId = e.group_id
        const daan = `答案是：${this.currentQuestions.get(e.group_id)?.daan}`
        const text1 = `群 ${groupId} 还没有开始新的猜成语游戏，请先输入“猜图猜成语”开始游戏。`
        if (!this.currentQuestions.has(groupId)) {
            const msg = [text1, btn1]
            e.reply(msg)
        } else {
            const questionMsg = [segment.image(this.currentQuestions.get(e.group_id)?.imageUrl), daan, Lbtn]
            e.reply(questionMsg)
            this.currentQuestions.delete(groupId)
        }
    }
}
