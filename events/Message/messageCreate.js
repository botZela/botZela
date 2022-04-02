const { MessageEmbed, Message, Client } = require("discord.js");
const { announcements } = require(`${process.cwd()}/utils/announcements.js`);
const { introduceYourSelf } = require(`${process.cwd()}/utils/introduceYouSelf.js`);
const { saveData } = require(`${process.cwd()}/utils/saveData.js`);
const data = require(`${process.cwd()}/data/data.json`);
const { createRole } = require(`${process.cwd()}/utils/createRole.js`);

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    async execute(client, message) {
        let announcementName = "announcement";
        let introduceName = "introd";
        let emploiName = "『📅』get-schedule";
        if (!message.guild || !SUPPORTED_GUILDS.includes(`${message.guildId}`)) {
            return;
        } else if (message.channel.name.includes(announcementName)) {
            await announcements(message);
        } else if (message.channel.name.includes(introduceName)) {
            await introduceYourSelf(message);
        } else if (message.channel.name.includes(emploiName)) {
            null;
        }
        /* if (message.author.id == "892346084913975307") {
                    if (message.content === "!bye") {
                        let channels = message.guild.channels.cache;
                        console.log(channels);
                        channels.forEach(channel => channel.delete());
                    }
                } */
        /* if (message.author.id == "892346084913975307") {
            if (message.content === "!promo") {
                let guild = message.guild;
                for (let i = 1995; i < 2022; i++) {
                    await createRole(client, guild, i);
                }
            }
        } */


    }

}