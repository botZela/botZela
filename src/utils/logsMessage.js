async function logsMessage(client, message, guild) {
    const { CHANNELS } = client.data;
    try {
        console.log(message);
        let channel = client.channels.cache.get(CHANNELS[`${guild.id}`]['LOGS']);
        await channel.send("```css\n" + message + "\n```");
    } catch (e) {
        console.log(`[EROR] Logs channel not set in ${guild.name}`);
    }
}

module.exports = {
    logsMessage,
}