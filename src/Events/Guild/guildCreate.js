const { setupLogsCommandsChannels } = require(`${process.cwd()}/src/utils/Command&LogsChannels/setupLogsCommandsChannel.js`);
const gRoles = require(`${process.cwd()}/src/Models/guildRoles.js`);

module.exports = {
    name: 'guildCreate',
    async execute(client, guild) {
        console.log(`[INFO] Joined server : ${guild.name}`);
        const roles = await guild.roles.fetch();

        const guildData = await gRoles.findOne({ guildId: guild.id });

        const roleObj = {};

        roles.forEach((role) => {
            roleObj[role.name] = role.id;
        });

        if (guildData){
            guildData.roles = roleObj;
            await guildData.save();
        } else {
            await gRoles.create({
                guildId: guild.id,
                guildName: guild.name,
                roles: roleObj,
            });
        }
        await setupLogsCommandsChannels(client, guild);
    },
}