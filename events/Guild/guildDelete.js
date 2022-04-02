const { saveData } = require(`${process.cwd()}/utils/saveData.js`);
const data = require(`${process.cwd()}/data/data.json`);
const { setupLogsCommandsChannels } = require(`${process.cwd()}/utils/setupLogsCommandsChannel.js`);

module.exports = {
    name: 'guildDelete',
    async execute(client, guild) {
        console.log(`[Info] Leave server : ${guild.name}`);
    },
}