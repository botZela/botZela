const { createCategory } = require("../utils/done/createCategory.js");
const { announcements } = require("../utils/done/announcements.js");
const { createLogsChannel } = require("../utils/done/createLogsChannel.js");
const { introduceYourSelf } = require("../utils/done/introduceYouSelf.js");
const {loadData} = require("../utils/done/loadData.js");
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
        category = await createCategory(client,message.guild,"test",undefined);
        await createLogsChannel(client,message.guild,undefined,category);
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