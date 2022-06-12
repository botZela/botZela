const { logsMessage } = require(`${process.cwd()}/src/utils/logsMessage`);
const gRoles = require("../../Models/guildRoles")

module.exports = {
    name: 'roleDelete',
    async execute(client, role) {
        try {
            const guildData = await gRoles.findOne({ guildId : role.guild.id});
            guildData.roles.delete(`${role.name}`);
            await guildData.save();
            let log = `[INFO] ${role.name} has been deleted.`;
            await logsMessage(client, log, role.guild);
        } catch (e) {
            let log = `[INFO] ${role.name} was not in data.`;
            await logsMessage(client, log, role.guild);
        }
    },
}