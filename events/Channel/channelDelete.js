const { createCommandsChannel } = require(`${process.cwd()}/utils/createCommandsChannel`);
const { createLogsChannel } = require(`${process.cwd()}/utils/createLogsChannel`);

module.exports = {
    name: 'channelDelete',
    async execute(client, channel) {
        if (channel.id === CHANNELS[`${channel.guildId}`]["COMMANDS"]) {
            await createCommandsChannel(client, channel.guild, undefined, channel.parent)
        } else if (channel.id === CHANNELS[`${channel.guildId}`]["LOGS"]) {
            await createLogsChannel(client, channel.guild, undefined, channel.parent);
        }
    },
}