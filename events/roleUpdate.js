const { saveData } = require("../utils/saveData");
const data = require("../data/data.json");
const { logsMessage } = require("../utils/logsMessage");

module.exports = {
    name: 'roleUpdate',
    async execute(client, oldRole, newRole) {
        let role = newRole;
        try {
            delete data["ROLES"][`${role.guild.id}`][`${role.name}`];
        } catch (e) {
            console.log(`[INFO] ${oldRole.name} role was not in data.`);
            let log = `[INFO] ${oldRole.name} role was not in data.`;
            await logsMessage(client, log, role.guild);
        }
        delete data["ROLES"][`${role.guild.id}`][`${oldRole.name}`];
        data["ROLES"][`${role.guild.id}`][`${role.name}`] = role.id;
        saveData();
        if (oldRole.name === newRole.name) {
            console.log(`[INFO] ${oldRole.name} role has been updated successfully.`);
            let log = `[INFO] ${oldRole.name} role has been updated successfully.`;
            await logsMessage(client, log, role.guild);
            return
        };
        console.log(`[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`);
        let log = `[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`;
        await logsMessage(client, log, role.guild);
    },
}