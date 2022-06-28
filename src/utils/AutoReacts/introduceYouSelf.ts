const {choice} = require("../choice.js");

async function introduceYourSelf(client,message){
    const SUPPORTED_GUILDS = client.testGuilds.map(guild => guild.id);
    if (SUPPORTED_GUILDS.includes(`${message.guildId}`)){
        const emojis = ["💯", "🎊", "👍", "👋", "🎉", "✨", "🥳"];
        for ( let i=0; i<3; i++){
            emoji = choice(emojis);
            await message.react(emoji);
            const index = emojis.indexOf(emoji);
            if (index > -1) {
                emojis.splice(index, 1);
            }
        }
    }
}

module.exports = {
    introduceYourSelf,
}