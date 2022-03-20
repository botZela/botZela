const { MessageEmbed } = require("discord.js");
const { announcements } = require("../utils/announcements.js");
const { introduceYourSelf } = require("../utils/introduceYouSelf.js");
const { saveData } = require("../utils/saveData.js");
const data = require("../data/data.json");

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        let announcementName = "announcement";
        let introduceName = "introd";
        let emploiName = "『📅』get-schedule";
        /* if (message.author.id == "892346084913975307") {
            if (message.content === "!bye") {
                let channels = message.guild.channels.cache;
                console.log(channels);
                channels.forEach(channel => channel.delete());
            }
        } */

        if (!message.guild || !SUPPORTED_GUILDS.includes(`${message.guildId}`)) {
            return;
        } else if (message.channel.name.includes(announcementName)) {
            await announcements(message);
        } else if (message.channel.name.includes(introduceName)) {
            await introduceYourSelf(message);
        } else if (message.channel.name.includes(emploiName)) {
            null;
        }
    }

}