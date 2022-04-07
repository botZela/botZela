const { createCommandsChannel } = require(`${process.cwd()}/src/utils/Command&LogsChannels/createCommandsChannel`);
const { createLogsChannel } = require(`${process.cwd()}/src/utils/Command&LogsChannels/createLogsChannel`);

module.exports = {
    name: 'channelDelete',
    async execute(client, channel) {
        const { CHANNELS } = client.data;
        if (channel.id === CHANNELS[`${channel.guildId}`]["COMMANDS"]) {
            await createCommandsChannel(client, channel.guild, undefined, channel.parent)
        } else if (channel.id === CHANNELS[`${channel.guildId}`]["LOGS"]) {
            await createLogsChannel(client, channel.guild, undefined, channel.parent);
        }
    },
}