const {choice} = require("./choice.js")
const {loadData} = require("./loadData.js");
loadData();


async function introduceYourSelf(message){
    if (message.guilId in SUPPORTED_GUILDS){
        const emojis = ["💯", "🎊", "👍", "👋", "🎉", "✨", "🥳"];
        for ( let i=0; i<3; i++){
            emoji = choice(emojis);
            await message.react(emoji);
            console.log(array);
            const index = emojis.indexOf(emoji);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
    }
}

module.exports = {
    introduceYourSelf,
}