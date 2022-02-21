async function announcements(message){
    if (message.guildId == '921408078983876678'){
        const emojis = ["👍", "👎"];
        for (emoji in emojis){
            await message.react(emoji);
        }
    }
}

module.exports = {
    announcements,
}