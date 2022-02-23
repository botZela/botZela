async function announcements(message){
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