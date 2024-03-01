import { segment } from 'oicq';
import plugin from "../../../lib/plugins/plugin.js";
import fetch from 'node-fetch';
import axios from "axios";

export class guessSaying extends plugin {
    constructor() {
        super({
            name: '看图猜成语',
            dsc: '看图猜成语',
            event: 'message',
            priority: Number.MIN_SAFE_INTEGER,
            rule: [
                {
                    reg: /^([#\/]?开始看图猜成语)$/,
                    fnc: 'startGame',
                },
                {
                    reg: /^([#\/]?猜.*)$/,
                    fnc: 'guess',
                },
            ],
            currentQuestions: {}, // 改为一个对象存储不同群组的当前问题
        });
    }

    async startGame(e) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/json',
                },
                body: JSON.stringify(data),
            });

            console.log('请求开始:', { url, data });
            if (response.ok) {
                const result = await response.json();
                console.log('请求结束:', { status: response.status, result });

                if (result.code === 200) {
                    // 成功
                    e.reply("游戏开始")

                    this.currentQuestions[groupId] = {
                        daan: result.daan,
                        imageUrl: result.img,
                    };

                    const img = segment.image(result.img);
                    const text_start = "# 开始看图猜成语\r"
                    const text = "请根据以下图片猜成语:\r"
                    const Cbutton = segment.button(
                        [
                            {
                                text: "猜",
                                input: "/猜"
                            }
                        ],
                        [
                            {
                                text: "拉Buer进群",
                                link: "https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0"
                            },
                            {
                                text: "拉Buer进频道",
                                link: "https://qun.qq.com/qunpro/robot/share?robot_appid=102042175"
                            },
                        ],
                    );
                    const msg = [text_start, text, img, Cbutton];
                    e.reply(msg);
                } else {
                    console.error(`在群 ${groupId} 获取题目时发生错误:`, result.message || '未知错误');
                    console.log(`在群 ${groupId} 获取题目时发生错误:`, result.message || '未知错误');
                    e.reply("获取题目时发生错误，请稍后再试。");
                }
            } else {
                console.error(`在群 ${e.group_id} 请求过程中发生错误: 状态码：${response.status}`);
                console.log(`在群 ${e.group_id} 请求过程中发生错误: 状态码：${response.status}`);
                e.reply("请求过程中发生错误，请稍后再试！！");
            }
        } catch (error) {
            console.error(`在群 ${e.group_id} 请求过程中发生错误:`, error);
            console.log(`在群 ${e.group_id} 请求过程中发生错误:`, error);
            logger.red(`在群 ${e.group_id} 请求过程中发生错误:`, error)
            e.reply("请求过程中发生错误，请稍后再试！！！！");
        }
    }

    // async startGame(e) {
    //     try {
    //         const groupId = e.group_id;
    //         console.log(`[看图猜成语][startGame] 开始向API请求数据...`);

    //         const response = await axios.get('http://api.yujn.cn/api/caicy.php', {
    //             timeout: 5000,
    //         });

    //         console.log(`[看图猜成语][startGame] 请求返回状态码：${response.status}`);
    //         if (response.status === 200) {
    //             const data = response.data;
    //             e.reply([text_start, data.text, data.img, Cbutton]);
    //             console.log(`[看图猜成语][startGame] 成功获取到数据：`, data);

    //         } else {
    //             console.error(`[看图猜成语][startGame] 获取题目时发生错误，响应状态码：${response.status}，错误信息：${response.statusText}`);
    //             e.reply([`服务器返回错误，状态码：${response.status}`]);
    //             throw new Error(`服务器返回错误，状态码：${response.status}`);
    //         }
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             console.error(`[看图猜成语][startGame] Axios 错误详情：`, error.response ? error.response.status : error.message);
    //         } else {
    //             console.error(`[看图猜成语][startGame] 发生未知错误：`, error.message || error.toString());
    //         }

    //         // 添加回复用户一条错误提示消息
    //         e.reply('抱歉，网络请求出现问题，请稍后再试。');
    //     }
    // }

    async startGame2(e) {
        try {
            const groupId = e.group_id;
            const response = await axios.get('http://api.yujn.cn/api/caicy.php?');
            const data = response.data;

            if (data.code === 200) {
                this.currentQuestions[groupId] = {
                    daan: data.daan,
                    imageUrl: data.img,
                };
                const img = segment.image(data.img);
                const text_start = "# 开始看图猜成语\r"
                const text = "请根据以下图片猜成语:\r"

                const Cbutton = segment.button(
                    [
                        {
                            text: "猜",
                            input: "/猜"
                        }
                    ],
                    [
                        {
                            text: "拉Buer进群",
                            link: "https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0"
                        },
                        {
                            text: "拉Buer进频道",
                            link: "https://qun.qq.com/qunpro/robot/share?robot_appid=102042175"
                        },
                    ],
                )

                const msg = [text_start, text, img, Cbutton];
                e.reply(msg); // 使用 e.reply() 发送消息
            } else {
                console.error(`在群 ${groupId} 获取题目时发生错误:`, data.message || '未知错误');
                // 可以在这里添加回复用户一条错误信息的消息
                e.reply('抱歉，获取题目时出错，请稍后再试。'); // 添加错误提示消息
            }
        } catch (error) {
            console.error(`在群 ${e.group_id} 请求过程中发生错误:`, error);
            // 可以在这里添加回复用户一条网络错误的信息
            e.reply('抱歉，网络请求出现问题，请稍后再试。'); // 添加网络错误提示消息
        }
    }

    async startGame3(e) {
        try {
            const groupId = e.group_id;
            const url = "http://api.yujn.cn/api/caicy.php?";

            var xhrGet = new XMLHttpRequest();
            xhrGet.open('GET', url, true);
            xhrGet.send();

            xhrGet.onerror = function () {
                console.error(`在群 ${e.group_id} 发生网络错误:`, xhrGet.status, xhrGet.statusText);
                e.reply("请求过程中发生网络错误，请稍后再试");
            };

            xhrGet.onreadystatechange = function () {
                if (xhrGet.readyState == 4) {
                    if (xhrGet.status == 200) {
                        // 成功
                        try {
                            var result = JSON.parse(xhrGet.responseText);
                            // ... 原始成功逻辑不变

                        } catch (parseError) {
                            console.error(`解析响应数据时发生错误: ${parseError}`);
                            e.reply("解析API数据时发生错误，请稍后再试！");
                        }
                    } else {
                        // 失败
                        console.error(`在群 ${e.group_id} 请求过程中发生错误: 状态码：${xhrGet.status}, 响应信息：${xhrGet.responseText}`);
                        e.reply("请求过程中发生错误，请稍后再试！！");
                    }
                }
            }.bind(this);
        }
        catch (error) {
            console.error(`在群 ${e.group_id} 请求过程中的全局错误:`, error.message || error.toString());
            e.reply("请求过程中发生错误，请稍后再试！！！！");
        }
    }

    async guess(e) {
        const groupId = e.group_id;
        const text1 = `群 ${groupId} 还没有开始新的猜成语游戏，请先输入“猜图猜成语”开始游戏。`;
        const btn1 = segment.button(
            [
                {
                    text: "开始游戏",
                    input: "/开始看图猜成语",
                    send: true,
                }
            ],
            [
                {
                    text: "拉Buer进群",
                    link: "https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0"
                },
                {
                    text: "拉Buer进频道",
                    link: "https://qun.qq.com/qunpro/robot/share?robot_appid=102042175"
                },
            ],
        );

        if (!this.currentQuestions[groupId]) {
            const msg = [text1, btn1];
            e.reply(msg);
            return;
        }

        const userAnswer = e.msg.replace(/^([#\/]?猜)/, "").trim();
        const btn = segment.button(
            [
                {
                    text: "再来一题",
                    input: "/开始看图猜成语",
                    send: true,
                }
            ],
            [
                {
                    text: "拉Buer进群",
                    link: "https://qun.qq.com/qunpro/robot/qunshare?robot_uin=2854208819&robot_appid=102042175&biz_type=0"
                },
                {
                    text: "拉Buer进频道",
                    link: "https://qun.qq.com/qunpro/robot/share?robot_appid=102042175"
                },
            ],
        );

        if (userAnswer.toLowerCase() === this.currentQuestions[groupId].daan.toLowerCase()) {
            e.reply(`答对了！成语是：${this.currentQuestions[groupId].daan}`);
            delete this.currentQuestions[groupId]; // 清除已解答的问题
        } else {
            const text = `很遗憾，答错了。正确答案是：${this.currentQuestions[groupId].daan}`
            const msg = [text, btn]
            e.reply(msg);
        }
    }
}