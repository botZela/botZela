const { Message, Client } = require("discord.js");
const { announcements } = require(`${process.cwd()}/src/utils/AutoReacts/announcements.js`);
const { introduceYourSelf } = require(`${process.cwd()}/src/utils/AutoReacts/introduceYouSelf.js`);

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    async execute(client, message) {
        const { SUPPORTED_GUILDS } = client.data;
        const { channel, author } = message;
        let announcementName = "announcement";
        let introduceName = "introd";
        let emploiName = "『📅』get-schedule";
        if (!message.guild || !SUPPORTED_GUILDS.includes(`${message.guildId}`)) {
            return;
        } else if (channel.name.includes(announcementName)) {
            await announcements(client,message);
        } else if (channel.name.includes(introduceName)) {
            if(author.bot) return;
            await introduceYourSelf(client,message);
        } else if (channel.name.includes(emploiName)) {
            if(author.bot) return;
            null;
        }
    }
}