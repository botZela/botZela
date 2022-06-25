const { createCommandsChannel } = require('../../utils/Command&LogsChannels/createCommandsChannel');
const { createLogsChannel } = require('../../utils/Command&LogsChannels/createLogsChannel');
const gChannels = require("../../Models/guildChannels");

module.exports = {
    name: 'channelDelete',
    async execute(client, channel) {
        const guildChannels = (await gChannels.findOne({guildId : channel.guildId})).channels;

        if (channel.id === guildChannels.get('COMMANDS')) {
            await createCommandsChannel(client, channel.guild, undefined, channel.parent)
        } else if (channel.id === guildChannels.get('LOGS')) {
            await createLogsChannel(client, channel.guild, undefined, channel.parent);
        }
    },
}