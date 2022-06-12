const { Message, Client } = require("discord.js");
const { announcements } = require(`${process.cwd()}/src/utils/AutoReacts/announcements.js`);
const { introduceYourSelf } = require(`${process.cwd()}/src/utils/AutoReacts/introduceYouSelf.js`);
const { messageSchedule } = require(`${process.cwd()}/src/utils/Schedule/autoResponceSchedule`);

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    async execute(client, message) {
        const SUPPORTED_GUILDS = client.testGuilds.map(guild => guild.id);
        const { channel, author } = message;
        let announcementName = "announcement";
        let introduceName = "introd";
        let emploiName = "『📅』get-schedule";
        if (!message.guild || !SUPPORTED_GUILDS.includes(`${message.guildId}`)) {
            return;
        } else if (channel.name.includes(announcementName)) {
            if(author.bot) return;
            await announcements(client,message);
        } else if (channel.name.includes(introduceName)) {
            if(author.bot) return;
            await introduceYourSelf(client,message);
        } else if (channel.name.includes(emploiName)) {
            if(author.bot || message.guild.id != client.testGuilds[0].id) return;
            messageSchedule(message);
        }
        if (message.content.startsWith("test")){
            message.reply(`Presence \`${message.guild.maximumPresences}\`, Memebers: \`${message.guild.maximumMembers}\``);
        }
    }
}