const { saveData } = require("../utils/saveData.js");
const data = require("../data/data.json");
const { logsMessage } = require("../utils/logsMessage.js");
module.exports = {
    name: 'roleCreate',
    async execute(client, role) {
        data["ROLES"][`${role.guild.id}`][`${role.name}`] = role.id;
        saveData();
        console.log(`[INFO] ${role.name} has been created.`);
        let log = "```css\n" + `[INFO] ${role.name} has been created.` + "\n```";
        await logsMessage(client, log, role.guild);
    },
}