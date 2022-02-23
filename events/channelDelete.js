const { createCommandsChannel } = require("../utils/createCommandsChannel");
const { createLogsChannel } = require("../utils/createLogsChannel");
const {loadData} = require("../utils/loadData.js");
loadData();

module.exports = {
	name: 'channelDelete',
	async execute(client,channel) {
        if(channel.id === CHANNELS[`${channel.guildId}`]["COMMANDS"]){
            await createCommandsChannel(client, channel.guild,undefined,channel.category)
        } else if (channel.id === CHANNELS[`${channel.guildId}`]["LOGS"]){
            await createLogsChannel(client,channel.guild,undefined,channel.category);
        }
	},  
}