const { GSpreadSheet } = require(`${process.cwd()}/src/otherModules/GSpreadSheet/gsp.js`);
const { logsMessage } = require(`${process.cwd()}/src/utils/logsMessage.js`);
const linksModel = require("../../Models/guildLinks");

module.exports = {
    name: 'guildMemberRemove',
    async execute(client, member) {
        const { guild, user } = member;
        const worksheetUrl = ( await  linksModel.findOne({guildId: guild.id}))?.spreadsheet;
        let logs = "";
        if (!worksheetUrl){
            console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
            logs = `[INFO] .${member.nickname} Left the server`;
            await logsMessage(client, logs, guild);
            return;
        }
        try {
            let gAccPath = `${process.cwd()}/credentials/google_account.json`;
            let activeSheet = await GSpreadSheet.createFromUrl(worksheetUrl, gAccPath, 0);
            if (user.bot) {
                logs = `[INFO] .${user.tag} is gone from the server.`;
                await logsMessage(client, logs, guild);
                return;
            }
            let index = await activeSheet.findCellCol(`${user.tag}`, "F");
            if (index == 0) {
                index = await activeSheet.findCellCol(`${user.id}`, "G");
                if (index == 0){
                    logs = `[INFO] .${user.tag} did not fill the form.`;
                    await logsMessage(client, logs, guild);
                    return;
                }
                await activeSheet.updateCell(`F${index}`, `${user.tag}`);
            }
            await activeSheet.updateCell(`G${index}`, `${member.id}`);
            await activeSheet.colorRow(index, "#FF00FF");
            logs = `[INFO] .${member.nickname} Left the server`;
            await logsMessage(client, logs, guild);
        } catch (e) {
            console.log(`[INFO] Sheet does not exist for server ${guild.name}`);
            logs = `[INFO] .${member.nickname} Left the server`;
            await logsMessage(client, logs, guild);
        }
    },
}