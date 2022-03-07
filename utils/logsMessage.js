async function logsMessage(client, message, guild) {
    try {
        let channel = client.channels.cache.get(CHANNELS[`${guild.id}`]['LOGS']);
        await channel.send("```css\n" + message + "\n```");
    } catch (e) {
        console.log(`Logs channel not set in ${guild.name}`);
    }
}

module.exports = {
    logsMessage,
}