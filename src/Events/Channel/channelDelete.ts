import { createCommandsChannel, createLogsChannel } from '../../utils/Command&LogsChannels';
import gChannels from '../../Models/guildChannels';
import { Event } from '../../Structures';
import { DMChannel } from 'discord.js';

export default {
	name: 'channelDelete',
	async execute(channel): Promise<void> {
		if (channel instanceof DMChannel) {
			return;
		}
		const guildChannels = (await gChannels.findOne({ guildId: channel.guildId })).channels;

		if (channel.id === guildChannels.get('COMMANDS')) {
			await createCommandsChannel(channel.guild, undefined, channel.parent);
		} else if (channel.id === guildChannels.get('LOGS')) {
			await createLogsChannel(channel.guild, undefined, channel.parent);
		}
	},
} as Event<'channelDelete'>;
