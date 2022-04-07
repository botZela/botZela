const { saveData } = require(`${process.cwd()}/src/utils/saveData`);
const { logsMessage } = require(`${process.cwd()}/src/utils/logsMessage`);

module.exports = {
    name: 'roleUpdate',
    async execute(client, oldRole, newRole) {
        if (oldRole.name == newRole.name) return;
        try {
            delete client.data["ROLES"][`${oldRole.guild.id}`][`${oldRole.name}`];
            client.data["ROLES"][`${newRole.guild.id}`][`${newRole.name}`] = newRole.id;
            saveData(client.data);
            let log = `[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`;
            await logsMessage(client, log, newRole.guild);
            return;
        } catch (e) {
            client.data["ROLES"][`${newRole.guild.id}`][`${newRole.name}`] = newRole.id;
            saveData(client.data);
            let log = `[INFO] ${oldRole.name} role was not in data.`;
            await logsMessage(client, log, oldRole.guild);
        }
    },
}