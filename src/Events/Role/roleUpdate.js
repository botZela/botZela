const { logsMessage } = require(`../../utils/logsMessage`);
const gRoles = require("../../Models/guildRoles")

module.exports = {
    name: 'roleUpdate',
    async execute(client, oldRole, newRole) {
        if (oldRole.name == newRole.name) return;
        let guildData;
        try{
            guildData = await gRoles.findOne({ guildId : newRole.guild.id});
        } catch (e) {
            let log = `[ERROR] Could not find the guild in DB.`;
            return await logsMessage(client, log, oldRole.guild);
        }
        
        try {
            guildData.roles.delete(`${oldRole.name}`);
            guildData.roles.set(`${newRole.name}`, newRole.id);
            await guildData.save();
            let log = `[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`;
            await logsMessage(client, log, newRole.guild);
            return;

        } catch (e) {
            guildData.roles.set(`${newRole.name}`, newRole.id);
            await guildData.save();
            let log = `[INFO] ${oldRole.name} role was not in data.`;
            await logsMessage(client, log, oldRole.guild);
        }
    },
}