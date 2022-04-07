
async function announcements(client,message){
    const { SUPPORTED_GUILDS } = client.data;
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