import axios from "axios";
import querystring from "querystring";

export class BashReboot extends plugin {
    constructor() {
        super({
            name: "bashReboot",
            des: "重启后端服务器",
            event: "message",
            rule: [
                {
                    reg: "^(\/|#|!|！)bash-reboot",
                    fnc: "bashReboot",
                },
            ],
        });
    }
    async bashReboot(e) {
        if (!e.isMaster) {
            e.reply("你没有权限执行此命令。");
            return;
        }
        await e.reply(`正在重启，请稍等...`);
        const options = {
            method: "post",
            url: "http://10.10.10.102:8000/runcommand/",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "curl/8.11.1 thenosehole/1.14514",
                Accept: "*/*",
            },
            data: {
                text: "reboot",
            },
        };
        axios(options)
            .then(function (response) {
                let result_lines = response.data.command_result.split("\n");
                let result_final = "";
                for (let i = 0; i < result_lines.length; i += 2) {
                    result_final += `${result_lines[i]}\n`;
                }
                console.log(result_final);
                e.reply(`重启命令已发送，请耐心等待服务器重启。`);
            })
            .catch(function (error) {
                console.log(error);
                e.reply(
                    `重启命令发送失败，请检查服务器运行状况。返回值：${error.response.status}`,
                );
            });
    }
}
