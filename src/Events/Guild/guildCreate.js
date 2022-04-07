const { saveData } = require(`${process.cwd()}/src/utils/saveData.js`);
const { setupLogsCommandsChannels } = require(`${process.cwd()}/src/utils/Command&LogsChannels/setupLogsCommandsChannel.js`);

module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        console.log(`[Info] Joined server : ${guild.name}`);
        const roles = await guild.roles.fetch();
        for (let role of roles) {
            role = role[1];
            client.data["ROLES"][`${guild.id}`][role.name] = role.id
        };
        saveData(client.data);
        await setupLogsCommandsChannels(client, guild);
    },
}