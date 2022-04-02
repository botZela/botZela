const { saveData } = require(`${process.cwd()}/utils/saveData`);
const data = require(`${process.cwd()}/data/data.json`);
const { logsMessage } = require(`${process.cwd()}/utils/logsMessage`);

module.exports = {
    name: 'roleUpdate',
    async execute(client, oldRole, newRole) {
        if (oldRole.name == newRole.name) return;
        try {
            delete data["ROLES"][`${oldRole.guild.id}`][`${oldRole.name}`];
            data["ROLES"][`${newRole.guild.id}`][`${newRole.name}`] = newRole.id;
            saveData();
            console.log(`[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`);
            let log = `[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`;
            await logsMessage(client, log, newRole.guild);
            return;
        } catch (e) {
            data["ROLES"][`${newRole.guild.id}`][`${newRole.name}`] = newRole.id;
            saveData();
            console.log(`[INFO] ${oldRole.name} role was not in data.`);
            let log = `[INFO] ${oldRole.name} role was not in data.`;
            await logsMessage(client, log, oldRole.guild);
        }
    },
}