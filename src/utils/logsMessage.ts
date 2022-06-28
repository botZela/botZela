const gChannels = require("../Models/guildChannels");

async function logsMessage(client, message, guild) {
    console.log(message);
    try {
        const guildChannels = (await gChannels.findOne({guildId : guild.id}))?.channels;
        if (!guildChannels){
            return console.log(`[EROR] Logs channel not set in ${guild.name}`);
        }
        const logsId = guildChannels.get('LOGS');
        let channel = client.channels.cache.get(logsId);
        await channel.send("```css\n" + message + "\n```");
    } catch (e) {
        console.log(`[EROR] Logs channel not set in ${guild.name}`);
    }
}

module.exports = {
    logsMessage,
}