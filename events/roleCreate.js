const { saveData } = require("../utils/saveData.js");
const data = require("../data/data.json");
const { logsMessage } = require("../utils/logsMessage.js");
module.exports = {
    name: 'roleCreate',
    async execute(client, role) {
        data["ROLES"][`${role.guild.id}`][`${role.name}`] = role.id;
        saveData();
        console.log(`[INFO] ${role.name} has been created.`);
        let log = `[INFO] ${role.name} has been created.`;
        await logsMessage(client, log, role.guild);
    },
}