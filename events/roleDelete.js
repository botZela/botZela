const { saveData } = require("../utils/saveData");
const data = require("../data/data.json");
const { logsMessage } = require("../utils/logsMessage");
module.exports = {
    name: 'roleDelete',
    async execute(client, role) {
        try {
            delete data["ROLES"][`${role.guild.id}`][`${role.name}`];
            saveData();
            console.log(`[INFO] ${role.name} has been deleted.`);
            let log = "```css\n" + `[INFO] ${role.name} has been deleted.` + "\n```";
            await logsMessage(client, log, role.guild);
        } finally {
            console.log(`[INFO] ${role.name} was not in data.`);
            let log = "```css\n" + `[INFO] ${role.name} was not in data.` + "\n```";
            await logsMessage(client, log, role.guild);
        }
    },
}