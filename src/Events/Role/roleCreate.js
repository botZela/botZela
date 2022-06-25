const { logsMessage } = require(`../../utils/logsMessage`);
const gRoles = require("../../Models/guildRoles")

module.exports = {
    name: 'roleCreate',
    async execute(client, role) {
        const guildData = await gRoles.findOne({ guildId : role.guild.id});
        guildData.roles.set(`${role.name}`, role.id);
        await guildData.save();
        let log = `[INFO] ${role.name} has been created.`;
        await logsMessage(client, log, role.guild);
    },
}