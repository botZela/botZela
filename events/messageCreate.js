const { MessageEmbed } = require("discord.js");
const { announcements } = require("../utils/announcements.js");
const { introduceYourSelf } = require("../utils/introduceYouSelf.js");


module.exports = {
	name: 'messageCreate',
	async execute(client,message) {

      let announcementName = "announcement";
      let introduceName = "introd";
      let emploiName  = "『📅』get-schedule";
      if (!message.guild || !SUPPORTED_GUILDS.includes(`${message.guildId}`)){
        return;
      }
      else if (message.channel.name.includes(announcementName)){
        await announcements(message);
      }
      else if (message.channel.name.includes(introduceName)){
        await introduceYourSelf(message);
      }
      else if (message.channel.name.includes(emploiName)){
        null;
      }
    }
      
}