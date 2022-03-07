const { saveData } = require("../utils/saveData");
const data = require("../data/data.json");

module.exports = {
    name: 'roleUpdate',
    async execute(client, oldRole, newRole) {
        try {
            delete data["ROLES"][`${role.guild.id}`][`${role.name}`];
        } catch (e) {
            console.log(`[INFO] ${oldRole.name} role was not in data.`);
            let log = "```css\n" + `[INFO] ${oldRole.name} role was not in data.` + "\n```";
            await logsMessage(client, log, role.guild);
        }
        data["ROLES"][`${role.guild.id}`][`${role.name}`] = role.id;
        saveData();
        if (oldRole.name === newRole.name) {
            console.log(`[INFO] ${oldRole.name} role has been updated successfully.`);
            let log = "```css\n" + `[INFO] ${oldRole.name} role has been updated successfully.` + "\n```";
            await logsMessage(client, log, role.guild);
            return
        };
        console.log(`[INFO] ${oldRole.name} role has been updated to ${newRole.name}.`);
        let log = "```css\n" + `[INFO] ${oldRole.name} role has been updated to ${newRole.name}.` + "\n```";
        await logsMessage(client, log, role.guild);
    },
}