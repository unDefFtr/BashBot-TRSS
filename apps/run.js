import axios from "axios";
import querystring from "querystring";

export class BashExec extends plugin {
    constructor() {
        super({
            name: "bashExec",
            des: "执行bash命令",
            event: "message",
            rule: [
                {
                    reg: "^(\/|#|!|！)bash (.*)",
                    fnc: "bashExec",
                },
            ],
        });
    }
    async bashExec(e) {
        await e.reply(`正在执行命令，请稍等...`);
        let comargs = e.msg.split(" ");
        let bannedcommands = [
            "reboot",
            "sudo",
            "su",
            "rm",
            "dd",
            "poweroff",
            "shutdown",
            "init",
            "halt",
        ];
        if (bannedcommands.indexOf(comargs[1]) !== -1 && !e.isMaster) {
            e.reply("Command " + comargs[1] + " banned!");
            return;
        }
        let fullcommand = "";
        for (let i = 1; i < comargs.length; i++) {
            fullcommand += comargs[i] + " ";
        }
        const options = {
            method: "post",
            url: "http://10.10.10.102:8000/runcommand/",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "curl/8.11.1 thenosehole/1.14514",
                Accept: "*/*",
            },
            data: {
                text: fullcommand,
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
                e.reply(`执行结果：\n${result_final}`);
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log(`执行完毕`);
    }
}
