const { announcements } = require("../utils/announcements.js");
const { introduceYourSelf } = require("../utils/introduceYouSelf.js");
const {loadData} = require("../utils/loadData.js");
loadData();

module.exports = {
	name: 'messageCreate',
	async execute(client,message) {
      let announcementName = "announcement";
      let introduceName = "introd";
      let emploiName  = "『📅』get-schedule";
      if (!message.guild || !SUPPORTED_GUILDS.includes(`${message.guildId}`)){
        console.log(1);
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