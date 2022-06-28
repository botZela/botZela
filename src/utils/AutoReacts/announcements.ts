
async function announcements(client,message){
    const SUPPORTED_GUILDS = client.testGuilds.map(guild => guild.id);
    if (SUPPORTED_GUILDS.includes(message.guildId)){
        const emojis = ["👍", "👎"];
        for (emoji of emojis){
            await message.react(emoji);
        }
    }
}

module.exports = {
    announcements,
}