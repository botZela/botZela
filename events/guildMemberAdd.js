const { saveData } = require("../utils/saveData.js");
const { loadData } = require("../utils/loadData.js");
const data = require("../data/data.json");
const { GSpreadSheet } = require("../GSpreadSheet/gsp.js");
const { logsMessage } = require("../utils/logsMessage.js");
const { giveRoles } = require("../utils/giveRoles.js");
const { kick } = require("../utils/kick.js");
const { Person } = require("../Member/member.js");
const { welcomeUser } = require("../utils/welcomeMsg.js");

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        let guild = member.guild;
        let logs = "```css\n";
        try {
            let url = WORKSHEETS_URL[`${guild.id}`];
            let gAccPath = "./credentials/google_account.json";
            let activeSheet = await GSpreadSheet.createFromUrl(url, gAccPath, 0);
            if (member.user.bot) {
                logs += `[INFO] .${member.user.tag} has got [Bots] role.\n`;
                logs += "```";
                await logsMessage(client, logs, guild);
                await member.roles.add(ROLES[`${guild.id}`]["Bots"]);
                return;
            }
            let index = await activeSheet.findCellCol(`${member.user.tag}`, "F");
            if (index == 0) {
                await kick(member);
                logs += `[INFO] .${member.user.tag} got kicked from the server\n`;
                logs += "```";
                await logsMessage(client, logs, guild);
                return;
            }
            await activeSheet.updateCell(`G${index}`, `${member.id}`);
            let newMem = await Person.create(index, guild, activeSheet);
            let nickName = newMem.nickName;
            await member.setNickname(nickName);
            logs += `[INFO] .${member.user.tag} nickname changed to ${nickName}\n`;
            // Only For ENSIAS PROMO
            console.log(member.guild.id);
            if (ADMINS.includes(member.id) && member.guild.id == '921408078983876678') {
                newMem.rolesId.push(PRV_ROLES[`${guild.id}`]["Admin"]);
                newMem.rolesNames.push("Admin");
            }
            await giveRoles(member, newMem.rolesId);
            await activeSheet.colorRow(index, "#F9BB03");
            console.log(newMem.rolesNames);
            logs += `[INFO] .${memberUsername} got Roles ` + newMem.rolesNames + `\n`;
            logs += "```";
            await logsMessage(client, logs, guild);
        } catch (e) {
            console.log(`Sheet does not exist for server ${guild.name}\n${e}`);
        }
        if (guild.systemChannel) {
            let toSend = welcomeUser(member);
            await guild.systemChannel.send(toSend);
        }
    },
}