import { segment } from 'oicq'
import plugin from '../../../lib/plugins/plugin.js'
import axios from 'axios'

const currentQuestions = new Map()

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
            const response = await axios.get('http://api.yujn.cn/api/caicy.php?')
            const data = await response.data

            if (data.code === 200) {
                this.currentQuestions.set(groupId, {
                    daan: data.daan,
                    imageUrl: data.img
                })
                const img = segment.image(data.img)
                const text_start = '# 开始看图猜成语\r'
                const text = '请根据以下图片猜成语:\r'

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

                const msg = [text_start, text, img, Cbutton]
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
        const btn1 = segment.button(
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

        if (!this.currentQuestions.has(groupId)) {
            const msg = [text1, btn1]
            e.reply(msg)
            return
        }

        const userAnswer = e.msg.replace(/^([#/]?猜)/, '').trim()
        const btn = segment.button(
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

        if (
            userAnswer.toLowerCase() ===
            this.currentQuestions.get(groupId)?.daan.toLowerCase()
        ) {
            e.reply(`答对了！成语是：${this.currentQuestions.get(groupId)?.daan}`)
            this.currentQuestions.delete(groupId) // 移除已解答的问题
        } else {
            const text = `很遗憾，答错了。正确答案是：${this.currentQuestions.get(groupId)?.daan}`
            const msg = [text, btn]
            e.reply(msg)
        }
    }
}
