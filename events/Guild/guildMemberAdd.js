const { GSpreadSheet } = require(`${process.cwd()}/src/GSpreadSheet/gsp.js`);
const { logsMessage } = require(`${process.cwd()}/utils/logsMessage.js`);
const { giveRoles } = require(`${process.cwd()}/utils/giveRoles.js`);
const { kick } = require(`${process.cwd()}/utils/kick.js`);
const { Person } = require(`${process.cwd()}/src/Member/member.js`);
const { welcomeUser } = require(`${process.cwd()}/utils/welcomeMsg.js`);

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        let guild = member.guild;
        let logs;
        try {
            let url = WORKSHEETS_URL[`${guild.id}`];
            let gAccPath = `${process.cwd()}/credentials/google_account.json`;
            let activeSheet = await GSpreadSheet.createFromUrl(url, gAccPath, 0);
            if (member.user.bot) {
                logs = `[INFO] .${member.user.tag} has got [Bots] role.`;
                await logsMessage(client, logs, guild);
                console.log(`[INFO] .${member.user.tag} has got [Bots] role.`);
                await member.roles.add(ROLES[`${guild.id}`]["Bots"]);
                return;
            }
            let index = await activeSheet.findCellCol(`${member.user.tag}`, "F");
            if (index == 0) {
                await kick(member);
                logs = `[INFO] .${member.user.tag} got kicked from the server`;
                await logsMessage(client, logs, guild);
                console.log(`[INFO] .${member.user.tag} got kicked from the server`);
                return;
            }
            await activeSheet.updateCell(`G${index}`, `${member.id}`);
            let newMem = await Person.create(index, guild, activeSheet);
            let nickName = newMem.nickName;
            await member.setNickname(nickName);
            logs = `[INFO] .${member.user.tag} nickname changed to ${nickName}`;
            // Only For ENSIAS PROMO
            console.log(`[INFO] .${member.user.tag} nickname changed to ${nickName}`);
            if (ADMINS.includes(member.id) && member.guild.id == '921408078983876678') {
                newMem.rolesId.push(PRV_ROLES[`${guild.id}`]["Admin"]);
                newMem.rolesNames.push("Admin");
            }
            await giveRoles(member, newMem.rolesId);
            await activeSheet.colorRow(index, "#F9BB03");
            logs += `\n[INFO] .${member.user.tag} got Roles [` + newMem.rolesNames + `]`;
            await logsMessage(client, logs, guild);
            console.log(`[INFO] .${member.user.tag} got Roles [` + newMem.rolesNames + `]`);
        } catch (e) {
            console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
        }
        if (guild.systemChannel) {
            let toSend = welcomeUser(member);
            await guild.systemChannel.send(toSend);
        }
    },
}