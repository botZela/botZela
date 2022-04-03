const { saveData } = require("../utils/saveData.js");
const data = require("../data/data.json");
const { setupLogsCommandsChannels } = require("../utils/setupLogsCommandsChannel.js");

module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        console.log(`[Info] Joined server : ${guild.name}`);
        const roles = await guild.roles.fetch();
        for (let role of roles) {
            role = role[1];
            data["ROLES"][`${guild.id}`][role.name] = role.id
        };
        saveData();
        await setupLogsCommandsChannels(client, guild);
    },
}