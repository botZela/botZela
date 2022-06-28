const { createChannel } = require("../Channels/createChannel");
const gChannels = require("../../Models/guildChannels");

async function createLogsChannel(client, guild, overwrites = null,category = null){
    if (!overwrites){
        overwrites = [
            {
                id : guild.roles.everyone.id,
                deny :["VIEW_CHANNEL"],
            },
            {
                id: client.user.id,
                allow: ['VIEW_CHANNEL'],
            }
        ] 
    }
    logs = await createChannel(client,guild,"『🤖』botZela-logs","text",overwrites,category)
    
    const guildData = await gChannels.findOne({ guildId: guild.id });

    if (guildData){
        guildData.channels.set('LOGS', logs.id);
        guildData.save();
    } else {
        gChannels.create({
            guildId: guild.id,
            guildName: guild.name,
            channels: {
                LOGS: logs.id,
            },
        });
    }

}

module.exports = {
    createLogsChannel,
}