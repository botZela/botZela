const { createChannel } = require("../util/createChannel.js");
const { announcements } = require("../util/done/announcements.js");
const { introduceYourSelf } = require("../util/done/introduceYouSelf.js");
const {loadData} = require("../util/done/loadData.js");
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