const { saveData } = require("../utils/saveData.js");
const data = require("../data/data.json");
const { setupLogsCommandsChannels } = require("../utils/setupLogsCommandsChannel.js");

module.exports = {
    name: 'guildDelete',
    async execute(client, guild) {
        console.log(`[Info] Leave server : ${guild.name}`);
    },
}