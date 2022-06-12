const { GSpreadSheet } = require(`${process.cwd()}/src/otherModules/GSpreadSheet/gsp.js`);
const { Person } = require(`${process.cwd()}/src/otherModules/Member/member.js`);
const { logsMessage } = require(`${process.cwd()}/src/utils/logsMessage.js`);
const { giveRoles } = require(`${process.cwd()}/src/utils/Guild/giveRoles.js`);
const { kick } = require(`${process.cwd()}/src/utils/Guild/kick.js`);
const { welcomeMsg } = require(`${process.cwd()}/src/utils/Guild/welcomeMsg.js`);

// Models
const gRoles = require("../../Models/guildRoles");
const linksModel = require("../../Models/guildLinks");

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        const { guild, user } = member;
        const guildRoles = ( await  gRoles.findOne({guildId: guild.id})).roles;
        const worksheetUrl = ( await  linksModel.findOne({guildId: guild.id}))?.spreadsheet;
        const { PRV_ROLES, ADMINS } = client.data;
        let logs;
        if (!worksheetUrl){
            if (guild.systemChannel) {
                let toSend = await welcomeMsg(client,member);
                guild.systemChannel.send(toSend);
            }
            return console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
        }
        try {
            // let url = WORKSHEETS_URL[`${guild.id}`];
            let gAccPath = `${process.cwd()}/credentials/google_account.json`;
            let activeSheet = await GSpreadSheet.createFromUrl(worksheetUrl, gAccPath, 0);
            if (user.bot) {
                logs = `[INFO] .${user.tag} has got [Bots] role.`;
                await logsMessage(client, logs, guild);
                await member.roles.add(guildRoles.get('Bots'));
                return;
            }
            let index = await activeSheet.findCellCol(`${user.tag}`, "F");
            if (index == 0) {
                index = await activeSheet.findCellCol(`${user.id}`, "G");
                if (index == 0){
                    await kick(member, guild);
                    logs = `[INFO] .${user.tag} got kicked from the server`;
                    await logsMessage(client, logs, guild);
                    return;
                }
                await activeSheet.updateCell(`F${index}`, `${user.tag}`);
            }
            await activeSheet.updateCell(`G${index}`, `${member.id}`);
            let newMem = await Person.create(index, client, guild, activeSheet);
            let nickName = newMem.nickName;
            await member.setNickname(nickName);
            logs = `[INFO] .${user.tag} nickname changed to ${nickName}`;
            // Only For ENSIAS PROMO
            if ( guild.id == '921408078983876678' && ADMINS.includes(member.id) ) {
                newMem.rolesId.push(PRV_ROLES[`${guild.id}`]["Admin"]);
                newMem.rolesNames.push("Admin");
            }
            await giveRoles(member, newMem.rolesId);
            await activeSheet.colorRow(index, "#F9BB03");
            logs += `\n[INFO] .${user.tag} got Roles [` + newMem.rolesNames.map(role => `'${role}'`) + `]`;
            await logsMessage(client, logs, guild);
        } catch (e) {
            console.error(e);
            console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
        }
        if (guild.systemChannel) {
            let toSend = await welcomeMsg(client, member);
            guild.systemChannel.send(toSend);
        }
    },
}